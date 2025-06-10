const CircularGauge = ({value, width, height, strokeWidth, strokeFillColor}) => {
	value = value < 0 ? 0 : value > 100 ? 100 : value;
	width = width || 48;
	height = height || 48;
	strokeWidth = strokeWidth || 4;
	strokeFillColor = strokeFillColor || '#4caf50';
	const radius = Math.min(width, height) / 2 - 10;
	const circumference = 2 * Math.PI * radius;
	const progress = Math.max(0, Math.min(value, 100));
	const strokeDashoffset = circumference - (progress / 100) * circumference;
	const centerX = width / 2;
	const centerY = height / 2;
  
	return (
	  <svg width={width} height={height}>
		<circle
		  cx={centerX}
		  cy={centerY}
		  r={radius}
		  fill="none"
		  stroke="#e0e0e0"
		  strokeWidth={strokeWidth}
		/>
		<circle
		  cx={centerX}
		  cy={centerY}
		  r={radius}
		  fill="none"
		  stroke={strokeFillColor}
		  strokeWidth={strokeWidth}
		  strokeDasharray={`${circumference} ${circumference}`}
		  strokeDashoffset={strokeDashoffset}
		  strokeLinecap="round"
		  transform={`rotate(-90 ${centerX} ${centerY})`}
		  style={{ transition: 'stroke-dashoffset 0.3s ease-in-out' }}
		/>
		<text
		  x={centerX}
		  y={centerY}
		  textAnchor="middle"
		  dominantBaseline="central"
		  style={{ fontSize: `${radius * 0.7}px`, fontWeight: 'bold', fill: '#333' }}
		>
		  {progress}
		</text>
	  </svg>
	);
}

export default CircularGauge;