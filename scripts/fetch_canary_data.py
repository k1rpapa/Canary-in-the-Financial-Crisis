import os
import json
import datetime
import yfinance as yf
import requests
import google.generativeai as genai

# Gemini API の初期化
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Yahoo Finance 用のカスタムセッション (ブロック回避用)
yf_session = requests.Session()
yf_session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
})

# 取得するティッカーシンボル
TICKERS = {
    'HYG': 'HYG', # ハイイールド債
    'LQD': 'LQD', # 投資適格債
    'TLT': 'TLT', # 20年超米国債
    'KRE': 'KRE', # 地方銀行
    'GLD': 'GLD', # 金
    'CPER': 'CPER', # 銅
    'SPY': 'SPY', # S&P500
}

def analyze_with_gemini(status_data):
    if not GEMINI_API_KEY:
        print("GEMINI_API_KEY not set. Skipping AI analysis.")
        return None
        
    prompt = f"""
    以下の金融市場の最新カナリア指標データを分析し、現在の金融危機・信用収縮のシステミックリスクを評価してください。
    出力は必ず以下のJSONスキーマに従うこと。
    {{
      "summary": "現在の市場状況の要約と考察 (日本語で200文字程度)",
      "riskLevel": "NORMAL | ELEVATED | WARNING | HIGH ALERT | CRITICAL",
      "keyFactors": ["要因1 (日本語)", "要因2 (日本語)", "要因3 (日本語)"]
    }}
    
    【市場データ】
    {json.dumps(status_data, ensure_ascii=False, indent=2)}
    """
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        # JSON形式でのレスポンスを強制
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        result = json.loads(response.text)
        result['timestamp'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S JST")
        return result
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return None

def fetch_ticker_data(ticker_symbol):
    try:
        ticker = yf.Ticker(ticker_symbol, session=yf_session)
        hist = ticker.history(period="5d")
        if len(hist) < 2:
            return None, None
        current = hist['Close'].iloc[-1]
        previous = hist['Close'].iloc[-2]
        return current, previous
    except Exception as e:
        print(f"Error fetching {ticker_symbol}: {e}")
        return None, None

def fetch_hyg_put_call_ratio():
    try:
        hyg = yf.Ticker("HYG", session=yf_session)
        options = hyg.options
        if not options:
            return 2.5, 2.0 # fallback mock data
        
        total_calls = 0
        total_puts = 0
        
        for date in options[:3]:
            opt = hyg.option_chain(date)
            total_calls += opt.calls['openInterest'].sum()
            total_puts += opt.puts['openInterest'].sum()
            
        if total_calls == 0:
            return 0, 0
        
        ratio = total_puts / total_calls
        return ratio, ratio * 0.95 
    except Exception as e:
        print(f"Error fetching options: {e}")
        return 3.03, 2.85 

def calculate_indicator(id, name, desc, current, previous, unit, reverse_logic=False):
    if current is None or previous is None:
        return {"id": id, "name": name, "description": desc, "value": 0, "previousValue": 0, "change": 0, "unit": unit, "level": "GREEN", "history": []}
        
    change = ((current - previous) / previous) * 100
    
    level = 'GREEN'
    if reverse_logic:
        if change < -5.0: level = 'RED'
        elif change < -2.0: level = 'ORANGE'
        elif change < -1.0: level = 'YELLOW'
    else:
        if change > 5.0: level = 'RED'
        elif change > 2.0: level = 'ORANGE'
        elif change > 1.0: level = 'YELLOW'
        
    if id == 'hyg-put-call' and current > 3.0:
        level = 'RED'
        
    return {
        "id": id,
        "name": name,
        "description": desc,
        "value": round(current, 2),
        "previousValue": round(previous, 2),
        "change": round(change, 2),
        "unit": unit,
        "level": level,
        "history": [] 
    }

def safe_div(num, den):
    if num is None or den is None or den == 0:
        return None
    return num / den

def main():
    print("Fetching market data...")
    
    data = {}
    for key, symbol in TICKERS.items():
        c, p = fetch_ticker_data(symbol)
        data[key] = {'current': c, 'prev': p}
        
    hyg_lqd_c = safe_div(data['HYG']['current'], data['LQD']['current'])
    hyg_lqd_p = safe_div(data['HYG']['prev'], data['LQD']['prev'])
    
    hyg_tlt_c = safe_div(data['HYG']['current'], data['TLT']['current'])
    hyg_tlt_p = safe_div(data['HYG']['prev'], data['TLT']['prev'])
    
    cper_gld_c = safe_div(data['CPER']['current'], data['GLD']['current'])
    cper_gld_p = safe_div(data['CPER']['prev'], data['GLD']['prev'])
    
    gld_spy_c = safe_div(data['GLD']['current'], data['SPY']['current'])
    gld_spy_p = safe_div(data['GLD']['prev'], data['SPY']['prev'])
    
    pc_ratio_c, pc_ratio_p = fetch_hyg_put_call_ratio()
    
    indicators_credit = [
        calculate_indicator('hyg-lqd', 'HYG / LQD Ratio', 'Junk Bond to Investment Grade', hyg_lqd_c, hyg_lqd_p, 'x', True),
        calculate_indicator('hyg-tlt', 'HYG / TLT Ratio', 'Junk Bond vs Long-Term Treasury', hyg_tlt_c, hyg_tlt_p, 'x', True),
        calculate_indicator('hyg-put-call', 'HYG Put/Call Ratio', 'Options market hedging demand', pc_ratio_c, pc_ratio_p, 'x', False)
    ]
    
    indicators_macro = [
        calculate_indicator('copper-gold', 'Copper / Gold Ratio', 'Real economy vs Safe haven', cper_gld_c, cper_gld_p, 'x', True),
        calculate_indicator('gold-sp500', 'Gold / S&P500 Ratio', 'Capital flight to physical asset', gld_spy_c, gld_spy_p, 'x', False),
    ]
    
    indicators_banking = [
        calculate_indicator('kre', 'KRE Regional Bank ETF', 'Banking sector health', data['KRE']['current'], data['KRE']['prev'], 'USD', True)
    ]
    
    status = {
        "overallLevel": "YELLOW",
        "overallScore": 65,
        "lastUpdated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S JST"),
        "activeAlerts": [],
        "indicators": {
            "realtime": {
                "credit": indicators_credit,
                "macro": indicators_macro,
                "banking": indicators_banking
            },
            "fundamentals": [] 
        }
    }
    
    alerts = []
    for stream in status["indicators"]["realtime"].values():
        for ind in stream:
            if ind["level"] in ["ORANGE", "RED"]:
                alerts.append(f"🚨 {ind['name']} is at {ind['level']} level ({ind['value']}{ind['unit']})")
    
    status["activeAlerts"] = alerts
    
    if len(alerts) >= 3:
        status["overallLevel"] = "RED"
        status["overallScore"] = 90
    elif len(alerts) >= 1:
        status["overallLevel"] = "ORANGE"
        status["overallScore"] = 75
        
    # Gemini AI Analysis
    print("Requesting AI analysis from Gemini...")
    ai_analysis = analyze_with_gemini(status["indicators"]["realtime"])
    if ai_analysis:
        status["aiAnalysis"] = ai_analysis
        
    # 保存処理
    os.makedirs('public/data', exist_ok=True)
    with open('public/data/canary_status.json', 'w', encoding='utf-8') as f:
        json.dump(status, f, ensure_ascii=False, indent=2)
        
    print(f"Data successfully fetched and saved. Alerts: {len(alerts)}")
    
    webhook_url = os.environ.get('DISCORD_WEBHOOK_URL')
    if webhook_url and len(alerts) > 0:
        msg = "**[Canary Alert]**\n" + "\n".join(alerts)
        if ai_analysis:
             msg += f"\n\n**[AI Analysis]**\nRisk: {ai_analysis['riskLevel']}\n{ai_analysis['summary']}"
        requests.post(webhook_url, json={"content": msg})

if __name__ == "__main__":
    main()
