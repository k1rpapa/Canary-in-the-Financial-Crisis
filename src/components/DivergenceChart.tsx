


interface DivergenceChartProps {
  title: string;
  data: any[];
  line1Key: string;
  line1Name: string;
  line1Color: string;
  line2Key: string;
  line2Name: string;
  line2Color: string;
}

export const DivergenceChart: React.FC<DivergenceChartProps> = ({
  title, data, line1Key, line1Name, line1Color, line2Key, line2Name, line2Color
}) => {
  return (
    <div className="card flex flex-col gap-4" style={{ minHeight: '100px', backgroundColor: 'var(--card-bg)' }}>
      <h3 className="heading-md text-secondary">{title}</h3>
      <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed var(--accent-orange)' }}>
        <p>グラフ描画テスト中（Rechartsが無効化されています）</p>
        <p>データ件数: {data ? data.length : 0}件</p>
      </div>
    </div>
  );
};
