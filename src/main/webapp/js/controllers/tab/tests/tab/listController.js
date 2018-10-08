define([
	'jquery',
	'../../../../common/util/handlebarsUtil',
	'../../../../common/util/templatesUtil',
	'../../../../common/util/cssUtil',
	'../../../../common/util/tabsUtil',
	'../../../../common/util/selectable',
	'../../../../common/constants',
	'./logsController',
	'./chartsController',
	'text!../../../../../templates/tab/tests/tab/list.hbs',
	'../../../../common/util/urlUtil'
], function ($,
             hbUtil,
             templatesUtil,
             cssUtil,
             tabsUtil,
             selectable,
             constants,
             logsController,
             chartsController,
             listTemplate) {

	const TAB_TYPE = templatesUtil.tabTypes();
	const TESTS_TAB_TYPE = templatesUtil.testsTabTypes();
	const plainId = templatesUtil.composeId;
	const jqId = templatesUtil.composeJqId;
	const listItemElemClass = 'list-group-item';


	var currentTestId;
	var currentTestMode;
	var okIcon;

	function render() {
		const renderer = rendererFactory();
		renderer.base();
	}

	const rendererFactory = function () {
		const listBlockElemId = jqId([TAB_TYPE.TESTS, 'tab', TESTS_TAB_TYPE.LIST]);

		function renderBase() {
			hbUtil.compileAndInsertInsideBefore(listBlockElemId, listTemplate);
		}

		return {
			base: renderBase
		}
	};

	function updateTestsList(testsObj, fullUpdate) {
		const testsListBlockElem = $(jqId([TAB_TYPE.TESTS, TESTS_TAB_TYPE.LIST]));
		testsListBlockElem.selectable();
		$.each(testsObj, function (runId, runIdInfo) {
			const runMode = runIdInfo.mode;
			const runStatus = runIdInfo.status.toLowerCase();
			var listItemElem = $(jqId([runId.replaceAll('\\.', '\\\.')]));
			const listItemElemText = runId + " - " + runMode + " - " + runStatus;
			if (!doesItemExist(listItemElem)) {
				listItemElem = $('<li/>',
					{
						id: runId,
						class: listItemElemClass,
						mode: runMode,
						status: runStatus
					});
				listItemElem.click(function () {
					makeItemActive(runId, runMode)
				});
				testsListBlockElem.append(listItemElem);
				if (runStatus !== 'stopped') {
					const stopIconElem = createStopIcon(runId);
					listItemElem.append(stopIconElem);
				} else {
					$(jqId([runIdForElem(runId), 'stop'])).remove();
				}
				const deleteIconElem = createDeleteIcon(runId);
				listItemElem.append(deleteIconElem);
			}
			replaceElementText(listItemElem, listItemElemText);
			if(!listItemElem.hasClass(runStatus)){
				listItemElem.addClass(runStatus);
			}
		});
		const testsIds = Object.keys(testsObj);
		if (fullUpdate) {
			const lastId = testsIds[testsIds.length - 1];
			if (lastId) {
				$(".list-group .list-group-item").removeClass('ui-selected');
				$(jqId([lastId.replaceAll('\\.', '\\\.')])).addClass('ui-selected');
			}
			makeItemActive(lastId, testsObj[lastId]);
		}
	}

	function replaceElementText(element, text) {
		element.contents().filter(function() {
			return this.nodeType === Node.TEXT_NODE;
		}).remove();
		if (element.text().indexOf('stopped') <= 0) {
			element.append(document.createTextNode(text));
		}
	}

	function doesItemExist(itemElem) {
		return itemElem.length;
	}
	
	function runIdForElem(runId) {
		return runId.replaceAll('\\.', '\\\.');
	}
	
	function createStopIcon(runId) {
		const div = $('<div/>', {
			id: plainId([runId, 'stop']),
			class: 'icon-stop tooltip'
		});
		const tooltipSpan = $('<span/>', {
			class: 'tooltiptext'
		});
		tooltipSpan.text('Click to stop the test');
		div.append(tooltipSpan);
		div.click(function () {
			$('.ui-selected').each(function () {
				const elemId = $(this).attr('id');
				if (elemId !== undefined) {
					stopEvent(elemId);

				}
			});
		});
		return div;
	}

	function createStopCommonIcon() {
		const div = $('<div/>', {
			class: 'icon-stop-common tooltip'
		});
		const tooltipSpan = $('<span/>', {
			class: 'tooltiptext'
		});
		tooltipSpan.text('Click to stop chosen tests');
		div.append(tooltipSpan);
		div.click(function () {
			$('.ui-selected').each(function () {
				const elemId = $(this).attr('id');
				if (elemId !== undefined) {
					stopEvent(elemId);
				}
			});
			$(this).remove();
		});
		return div;
	}
	
	function stopEvent(runId) {
		const listItemElem = $(jqId([runIdForElem(runId)]));
		listItemElem.attr('class', listItemElem.attr('class') + ' stopped');
		listItemElem.attr('status', 'stopped');
		$(jqId([runIdForElem(runId), 'stop'])).remove();
		const listItemElemText = runId + " - " + (listItemElem.attr('mode')) + " - " + (listItemElem.attr('status'));
		replaceElementText(listItemElem, listItemElemText);
		const stopEventHttpMethod = 'POST';
		performAjaxRequestForTest(stopEventHttpMethod, onEventStop);
		// $.ajax({
		// 	type: 'POST',
		// 	url: '/run',
		// 	dataType: 'json',
		// 	contentType: constants.JSON_CONTENT_TYPE,
		// 	data: JSON.stringify({ runId: runId }),
		// 	processData: false
		// }).done(function (testsObj) {
		// 	updateTestsList(testsObj, false);
		// 	console.log('[stopEvent] Mongoose ran');
		// });
	}

	function onEventStop(testsObj) { 
		pdateTestsList(testsObj, false);
		console.log('[stopEvent] Mongoose event stopped');
	}

	function createDeleteIcon(runId) {
		const div = $('<div/>', {
			id: plainId([runId, 'delete']),
			class: 'icon-delete tooltip'
		});
		const tooltipSpan = $('<span/>', {
			class: 'tooltiptext'
		});
		tooltipSpan.text('Click to remove the test');
		div.append(tooltipSpan);
		div.click(function () {
			$('.ui-selected').each(function () {
				const elemId = $(this).attr('id');
				if (elemId !== undefined) {
					deleteEvent(elemId);
				}
			});
		});
		return div;
	}

	function createDeleteCommonIcon() {
		const div = $('<div/>', {
			class: 'icon-delete-common tooltip'
		});
		const tooltipSpan = $('<span/>', {
			class: 'tooltiptext'
		});
		tooltipSpan.text('Click to remove chosen tests');
		div.append(tooltipSpan);
		div.click(function () {
			$('.ui-selected').each(function () {
				const elemId = $(this).attr('id');
				if (elemId !== undefined) {
					deleteEvent(elemId);
				}
			});
			$(this).remove();
			$('.icon-stop-common').remove();
		});
		return div;
	}
	
	function deleteEvent(runId) {
		const listItemElem = $(jqId([runIdForElem(runId)]));
		listItemElem.remove();
		const deleteEventMethod = 'DELETE'
		performAjaxRequestForTest(deleteEventMethod, onTestRemoved);
		// $.ajax({
		// 	type: 'DELETE',
		// 	url: '/run',
		// 	dataType: 'json',
		// 	contentType: constants.JSON_CONTENT_TYPE,
		// 	data: JSON.stringify({ runId: runId }),
		// 	processData: false
		// }).done(function () {
		// 	console.log('The test is removed');
		// });
	}

	function onTestRemoved() { 
		console.log('Test has been removed');
	}

	function performAjaxRequestForTest(httpMethod, callback) {
	    const mangooseTestRunRedirectionUrl = constants.BASE_URL + constants.MANGOOSE_RUNNING_PAGE_URL;
	    checkIfURLisReachable(mangooseTestRunRedirectionUrl, function(status) {
	        if (status == 200) {
	            $.ajax({
	                type: httpMethod,
	                url: constants.BASE_URL + constants.MANGOOSE_RUNNING_PAGE_URL,
	                dataType: 'json',
	                contentType: constants.JSON_CONTENT_TYPE,
	                data: SON.stringify({
	                    runId: runId
	                }),
	                processData: false
	            }).done(callback);
	        } else if (status == 404) {
	            const misleadingMsg = 'Page not found: ' + mangooseTestRunRedirectionUrl;
	            alert(misleadingMsg);
	        } else {
	            const misleadingMsg = "An error has occured while trying to acces URL " + mangooseTestRunRedirectionUrl;
	            alert(misleadingMsg)
	        }
	    });

	}

	function createOkIcon(runId) {
		return $('<div/>', {
			id: plainId([runId, 'check']),
			class: 'icon-check'
		});
	}

	function makeItemActive(testId, testMode) {
		const stopSelector = ".icon-stop-common";
		const deleteSelector = ".icon-delete-common";
		$(stopSelector).remove();
		$(deleteSelector).remove();
		const $selected = $('.ui-selected');
		if ($selected.length > 1) {
			const testsList = $('#tests-list');
			testsList.after(createDeleteCommonIcon());
			testsList.after(createStopCommonIcon());
		}
		$(".list-group .list-group-item .icon-check").remove();
		$(".list-group .list-group-item").css('padding-left', '');
		$(".list-group .list-group-item").css('color', 'black');
		$.each($(".list-group .ui-selected"), function(index, elem) {
			$(elem).append(createOkIcon(elem.id));
			$(elem).css('padding-left', '40px');
			$(elem).css('color', 'white');
		});
		currentTestId = testId;
		currentTestMode = testMode;
		logsController.resetLogs();
		chartsController.runCharts(testId);
	}

	function getCurrentTestId() {
		return currentTestId;
	}

	function getCurrentTestMode() {
		return currentTestMode;
	}
	
	return {
		render: render,
		updateTestsList: updateTestsList,
		currentTestId: getCurrentTestId,
		currentTestMode: getCurrentTestMode
	}
});