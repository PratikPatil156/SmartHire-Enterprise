const ScoreCard = ({ title, score, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border-l-4" style={{ borderColor: color }}>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <div className="flex items-center mt-2">
      <span className="text-3xl font-bold text-gray-800">{score}%</span>
      <div className="ml-4 w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full" 
          style={{ width: `${score}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  </div>
);
export default ScoreCard;