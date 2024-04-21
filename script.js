
import createCanvas from "./createCanvas.js";


//東京中心の正距方位図法
const lng = 139.7672;
const lat = 35.6811;

//https://proj.org/en/9.4/operations/projections/aeqd.html
proj4.defs("aeqd", `+proj=aeqd +lat_0=${lat} +lon_0=${lng} +x_0=0 +y_0=0 +a=6378137 +b=6378137 +datum=WGS84 +units=m +no_defs`);
ol.proj.proj4.register(proj4);

const projection = new ol.proj.Projection({
	code: "aeqd",
	extent: [-120e5, -120e5, 120e5, 120e5],
});


const canvasFunction = function (extent, resolution, pixelRatio, size, projection) {

	//表示条件
	const [width, height] = size.map(e => Math.floor(e));
	const bbox = extent;

	//canvasを返す
	return createCanvas(width, height, bbox);
};


const layer = new ol.layer.Image({
	source: new ol.source.ImageCanvas({
		canvasFunction,
		ratio: 1,
		interpolate: false,
	}),
});


const map = new ol.Map({
	target: "map",
	// pixelRatio: 1,

	layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM(),
			className: "basemap",
		}),
		layer,
	],

	view: new ol.View({
		// center: ol.proj.fromLonLat([lng,lat + 0.15], projection),
		center: [0,0],
		zoom: 14,
		projection,
	}),
});