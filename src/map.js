/**
 * Map super class.
 * @author quentin.yang@angejia.com
 * @constructor
 */
function Map(args) {
    this.map;
    this.mapOpts = {};
    this.cache = {};

    args && this.init(args);

}

/**
 * Init map
 * @param args
 * {
 *  id: ''//required element id
 *  opts: {}//map options
 * }
 */
Map.prototype.init = function(args) {
    var opts = args.opts || {};
    this.mapOpts = opts;

    if (args.id) {
        var map = new AMap.Map(args.id, {
            zoom: opts.zoom || 12,
            center: opts.center,
            lang: opts.lang || 'zh_cn'
        });

        this.map = map;
    }
};
/**
 * Add marker
 * @param pos array
 * e.g.: [121.492996, 31.210452]
 */
Map.prototype.addMarker = function(pos) {
    var marker = new AMap.Marker({
        position: pos,
        map: this.map
    });
};
/**
 * add batch markers
 * @param markers
 * [
 *  [121.492996,31.210452]
 *  [121.708088,31.184903]
 * ]
 */
Map.prototype.addMarkers = function(markers) {
    var len = markers.length;
    for (var i = 0; i < len; i++) {
        this.addMarker(markers[i]);
    }
};
Map.prototype.addInfoWindow = function() {
    //TODO::
};
Map.prototype.addPlugin = function() {
    //TODO::
};

/**
 * Map Search
 * @param opts
 * {
 *  keyword: '',
 *  callback: fn,
 *  point: {lng: 0, lat: 0}
 *
 * }
 */
Map.prototype.search = function(opts) {
    var self = this;
    AMap.service('AMap.PlaceSearch',function() {
        var placeSearch = new AMap.PlaceSearch({
            map: self.map,
            pageSize: opts.pageSize || 10,
            pageIndex: opts.pageIndex || 1,
            panel: opts.panel ? opts.panel : null
        });

        if (opts.type) {
            placeSearch.setType(opts.type);
        }
        if (opts.city) {
            placeSearch.setCity(opts.city);
        }

        placeSearch.search(opts.keyword, function(status, result) {
            self._done(status, result, opts.callback);
        });

    });
};
/**
 * Search nearby
 * @param opts
 * {
 *  keyword: '',
 *  center: [0, 12],
 *  city: '',
 *  pageSize: 10,
 *  pannel: 'result-container',
 *  radius: 1000,//1000 m
 *  callback: fn
 *  type: '餐饮|酒店|电影院'
 *  POI搜索类型共分为以下20种：
 *  汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|
 *  政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施
 *  默认值：餐饮服务、商务住宅、生活服务
 * }
 */
Map.prototype.searchNearBy = function(opts) {
    var self = this,
        center = opts.center;
    AMap.service('AMap.PlaceSearch',function() {
        var placeSearch = new AMap.PlaceSearch({
            map: self.map,
            pageSize: opts.pageSize || 10,
            pageIndex: opts.pageIndex || 1,
            panel: opts.panel ? opts.panel : null
        });

        if (opts.type) {
            placeSearch.setType(opts.type);
        }
        if (opts.city) {
            placeSearch.setCity(opts.city);
        }

        placeSearch.searchNearBy(opts.keyword || '', center, opts.radius, function(status, result) {
            self._done(status, result, opts.callback);
        });

    });
};
Map.prototype._done = function (status, result, callback) {
    if (status === 'complete' && result.info === 'OK') {
        callback && callback(status, result);
    } else if (status === 'error') {
        //TODO
    } else if (status === 'no_data') {
        //TODO
    }
};