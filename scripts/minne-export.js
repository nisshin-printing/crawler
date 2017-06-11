/**
 * minneの商品をCSV形式で出力するスクリプト
 * 
 * 2017-06-09時点でのDOM構造に対応。
 * Google Chromeでテスト済み
 */

{
	/**
	 * HTMLを取得
	 */
	function get(url, verbose) {
		var df = $.Deferred();
		$.ajax({
			url: url,
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-Requested-With', {
					toString: function () {
						return '';
					}
				});
			}
		}).success(function (data) {
			df.resolve(data);
		}).fail(function (jqXHR, msg) {
			if (verbose) console.log('fail', msg);
		});
		return df.promise();
	}


	/**
	 * itemの情報を配列で保管
	 */
	function load(url, verbose) {
		var df = $.Deferred();
		var page = get(url, verbose);
		var items = [];
		page.done(function (data) {
			// var dom = jQuery.parseHTML(data);
			var itemWrap = $(data).find('#container .gallery-item');
			itemWrap.each(function () {
				const box = $(this);
				const item = box.find('.js-product-list-click-tracking');

				var product = {};
				product.id = item.data('product-id');
				product.name = item.data('product-name');
				product.price = item.data('product-price');
				product.category = item.data('product-category');
				product.href = 'https://minne.com' + item.attr('href');
				product.image = "https:" + itemWrap.find('img.product_photo').attr('src');
				items.push(product);
			});
			if (items.length <= 0) df.reject();
			else df.resolve(items);
		});
		return df.promise();
	}


	/**
	 * 商品一覧をCSVフォーマットにして返す
	 */
	function formatEntry(entry) {
		var array = [
			'"' + entry.id + '"',
			'"' + entry.name + '"',
			'"' + entry.price + '"',
			'"' + entry.category + '"',
			'"' + entry.href + '"',
			'"' + entry.image + '"'
		];
		return array.join(',') + '\n';
	}

	/**
	 * popup
	 */
	function popup(content) {
		var generator = window.open('', 'name', 'width=800,height=600');
		generator.document.write('<html><head><title>minneの商品一覧をCSVで出力</title></head><body><pre>' + content + '</pre></body></html>');
		generator.document.close();
		return generator;
	}


	/**
	 * CSVをダウンロード
	 */
	function dlCSV(content) {
		var uri = 'data:text/csv' + encodeURIComponent(content);
		var link = document.createElement('a');
		link.download = 'output.csv';
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}



	/**
	 * Start.
	 */
	var tempArray = {};
	var _return = '';

	function start(num) {
		if (typeof num !== 'number') {
			num = 1;
			$('<div/>').css({
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				zIndex: 10000,
				backgroundColor: 'rgba(0,0,0,.8)',
				color: '#FFF',
				fontSize: 30,
				textAlign: 'center',
				paddingTop: '15em'
			}).attr('id', '___overlay').text('minneの商品をエクスポート!!').appendTo('body');
		};
		var url = 'https://minne.com/@mimicchii?page=' + num;
		var progress = load(url, false);
		$('#___overlay').text(num + 'ページ目のデータ収集中...');
		progress.done(function (results) {
			if (typeof tempArray[num] === 'undefined') tempArray[num] = results;
			else tempArray[num] += tempArray[num].concat[results];
			start(num + 1);
		}).fail(function () {
			console.log(tempArray);
			$.each(tempArray, function (pageNum, results) {
				$.each(results, function () {
					_return += formatEntry(this, false);
				});
			});
			popup(_return);
			// result.
			$('#___overlay').remove();
		});
	}
	start();
};
