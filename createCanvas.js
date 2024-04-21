
const planets = [
	{ name: "太陽", 	r: 696340,		a: 0,			},
	{ name: "水星",		r: 2439,		a: 58000000,		},
	{ name: "金星",		r: 6051,		a: 108200000,	},
	{ name: "地球",		r: 6371,		a: 149600000,
		sat: [
			{ name: "月",	r: 1737,	a: 384400	},
		],
	},
	{ name: "火星",		r: 3389,		a: 227900000,	},
	{ name: "木星",		r: 69911,		a: 778500000,	},
	{ name: "土星",		r: 58232,		a: 1.434e9,	},
	{ name: "天王星",	r: 25362,		a: 2.871e9,	},
	{ name: "海王星",	r: 24622,		a: 4.495e9,	},
];

//地球を直径30cmにする比率[cm/km]
const scale = 0.3 / (6371 * 2);

export default function (width, height, bbox) {

	//描画用canvas
	const cv = document.createElement("canvas");
	cv.width = width;
	cv.height = height;
	const ctx = cv.getContext("2d");

	//座標変換
	ctx.translate(width * 0.5, height * 0.5);
	ctx.scale(width / (bbox[2] - bbox[0]), -height / (bbox[3] - bbox[1]));
	ctx.translate(-(bbox[2] + bbox[0]) * 0.5, -(bbox[3] + bbox[1]) * 0.5);

	//解像度
	const level = (bbox[2] - bbox[0]) / width;

	
	//横軸を表示
	{
		ctx.lineWidth = Math.max(level * 3, 1);		//3px～1m
		const r = 149600000 * 120 * scale;

		ctx.strokeStyle = "rgba(255,255,0,0.3)";
		ctx.beginPath();
		ctx.moveTo(-r, 0);
		ctx.lineTo(r, 0);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, -r);
		ctx.lineTo(0, r);
		ctx.stroke();
	}

	const drawInfo = function(ctx,name,a,r,size,dx){
		ctx.save();
		const mx = (r + 300 + dx) * size;
		const my = -(r + 300) * size;
		
		//引き出し線
		ctx.beginPath();
		ctx.moveTo(r, -r);
		ctx.lineTo(mx - 85 * size, my + 10 * size);
		ctx.strokeStyle = "rgba(255,255,255,1)";
		ctx.lineWidth = level;
		ctx.stroke();

		//ラベル
		ctx.beginPath();
		ctx.moveTo(mx - 60 * size, my + 10 * size);
		ctx.lineTo(mx - 60 * size, my - (100 + 80 * 2 + 10) * size);
		ctx.lineWidth = 50 * size;
		ctx.stroke();

		//文字
		ctx.translate(mx, my - 80 * size);
		ctx.save();
		ctx.scale(1, -1);
		ctx.fillStyle = "white";
		ctx.font = (100 * size) + "px sans-serif";
		ctx.fillText(name, 0, 0);
		ctx.restore();

		ctx.translate(0, -80 * size);
		ctx.save();
		ctx.scale(1, -1);
		ctx.fillStyle = "white";
		ctx.font = (50 * size) + "px sans-serif";
		ctx.fillText("距離" + (a * 0.001).toFixed(3) + "km", 0, 0);
		ctx.restore();

		ctx.translate(0, -80 * size);
		ctx.save();
		ctx.scale(1, -1);
		ctx.fillStyle = "white";
		ctx.font = (50 * size) + "px sans-serif";
		ctx.fillText("直径" + (r * 2).toFixed(3) + "m", 0, 0);
		ctx.restore();

		ctx.restore();
	};

	
	planets.forEach(e => {
		const a = e.a * scale;
		const r = e.r * scale;
		
		ctx.beginPath();
		ctx.arc(0, 0, a, 0, 2 * Math.PI, false);
		ctx.strokeStyle = "rgba(255,255,255,0.3)";
		ctx.lineWidth = Math.max(level * 3, 1);		//3px～1m
		ctx.stroke();
		
		
		ctx.save();
		ctx.translate(a, 0);

		ctx.beginPath();
		ctx.arc(0, 0, r, 0, 2 * Math.PI, false);
		ctx.fillStyle = "red";
		ctx.fill();

		//名前、情報表示
		drawInfo(ctx,e.name,a,r,1,0);
		
		if(e.sat != undefined){
			ctx.strokeStyle = "rgba(255,255,255,0.3)";
			e.sat.forEach(s => {
				const sa = s.a * scale;
				const sr = s.r * scale;

				ctx.beginPath();
				ctx.arc(0, 0, sa, 0, 2 * Math.PI, false);
				ctx.stroke();
				
				ctx.save();
				ctx.translate(sa, 0);
				ctx.beginPath();
				ctx.arc(0, 0, sr, 0, 2 * Math.PI, false);
				ctx.fill();
				
				drawInfo(ctx,s.name,sa,sr,0.1,300);

				ctx.restore();
			});
		}
		
		ctx.restore();
	});

	return cv;
}