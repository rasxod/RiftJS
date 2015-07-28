(function() {
	var bindCells = rt.bindCells;
	var Disposable = rt.Disposable;

	/**
	 * @class Rift.BaseModel
	 * @extends {Rift.Disposable}
	 * @abstract
	 * @typesign new (data?: Object): Rift.BaseModel;
	 */
	var BaseModel = Disposable.extend({
		constructor: function(data) {
			Disposable.call(this);

			if (this._initAssets) {
				this._initAssets(data || {});
				bindCells(this);
			}
		},

		/**
		 * @typesign (data: Object);
		 */
		collectDumpObject: function(data) {
			var names = Object.keys(this);

			for (var i = 0, l = names.length; i < l; i++) {
				var value = Object.getOwnPropertyDescriptor(this, names[i]).value;

				if (typeof value == 'function' && value.constructor == cellx) {
					var cell = value('unwrap', 0);

					if (!cell.computed) {
						var cellValue = cell.read();

						if (cellValue === Object(cellValue) ? cell.changed() : cell.initialValue !== cellValue) {
							data[names[i]] = cellValue;
						}
					}
				}
			}
		},

		/**
		 * @typesign (data: Object);
		 */
		expandFromDumpObject: function(data) {
			for (var name in data) {
				this[name](data[name]);
			}
		}
	});

	rt.BaseModel = BaseModel;
})();
