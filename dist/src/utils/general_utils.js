"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printChart = exports.calculateStartEndFromDepend = exports.makeRequestOldBrowsers = exports.makeRequest = exports.moveToolTip = exports.updateFlyingObj = exports.isParentElementOrSelf = exports.criticalPath = exports.hashKey = exports.hashString = exports.fadeToolTip = exports.hideToolTip = exports.isIE = exports.getOffset = exports.calculateCurrentDateOffset = exports.getScrollbarWidth = exports.getScrollPositions = exports.benchMark = exports.getZoomFactor = exports.delayedHide = exports.stripUnwanted = exports.stripIds = exports.changeFormat = exports.findObj = exports.internalPropertiesLang = exports.internalProperties = void 0;
exports.internalProperties = ['pID', 'pName', 'pStart', 'pEnd', 'pClass', 'pLink', 'pMile', 'pRes', 'pComp', 'pGroup', 'pParent',
    'pOpen', 'pDepend', 'pCaption', 'pNotes', 'pGantt', 'pCost', 'pPlanStart', 'pPlanEnd', 'pPlanClass'];
exports.internalPropertiesLang = {
    'pID': 'id',
    'pName': 'name',
    'pStart': 'startdate',
    'pEnd': 'enddate',
    'pLink': 'link',
    'pMile': 'mile',
    'pRes': 'res',
    'pDuration': 'dur',
    'pComp': 'comp',
    'pGroup': 'group',
    'pParent': 'parent',
    'pOpen': 'open',
    'pDepend': 'depend',
    'pCaption': 'caption',
    'pNotes': 'notes',
    'pCost': 'cost',
    'pPlanStart': 'planstartdate',
    'pPlanEnd': 'planenddate',
    'pPlanClass': 'planclass'
};
exports.findObj = function (theObj, theDoc) {
    if (theDoc === void 0) { theDoc = null; }
    var p, i, foundObj;
    if (!theDoc)
        theDoc = document;
    if (document.getElementById)
        foundObj = document.getElementById(theObj);
    return foundObj;
};
exports.changeFormat = function (pFormat, ganttObj) {
    if (ganttObj)
        ganttObj.setFormat(pFormat);
    else
        alert('Chart undefined');
};
exports.stripIds = function (pNode) {
    for (var i = 0; i < pNode.childNodes.length; i++) {
        if ('removeAttribute' in pNode.childNodes[i])
            pNode.childNodes[i].removeAttribute('id');
        if (pNode.childNodes[i].hasChildNodes())
            exports.stripIds(pNode.childNodes[i]);
    }
};
exports.stripUnwanted = function (pNode) {
    var vAllowedTags = new Array('#text', 'p', 'br', 'ul', 'ol', 'li', 'div', 'span', 'img');
    for (var i = 0; i < pNode.childNodes.length; i++) {
        /* versions of IE<9 don't support indexOf on arrays so add trailing comma to the joined array and lookup value to stop substring matches */
        if ((vAllowedTags.join().toLowerCase() + ',').indexOf(pNode.childNodes[i].nodeName.toLowerCase() + ',') == -1) {
            pNode.replaceChild(document.createTextNode(pNode.childNodes[i].outerHTML), pNode.childNodes[i]);
        }
        if (pNode.childNodes[i].hasChildNodes())
            exports.stripUnwanted(pNode.childNodes[i]);
    }
};
exports.delayedHide = function (pGanttChartObj, pTool, pTimer) {
    var vDelay = pGanttChartObj.getTooltipDelay() || 1500;
    if (pTool)
        pTool.delayTimeout = setTimeout(function () { exports.hideToolTip(pGanttChartObj, pTool, pTimer); }, vDelay);
};
exports.getZoomFactor = function () {
    var vFactor = 1;
    if (document.body.getBoundingClientRect) {
        // rect is only in physical pixel size in IE before version 8
        var vRect = document.body.getBoundingClientRect();
        var vPhysicalW = vRect.right - vRect.left;
        var vLogicalW = document.body.offsetWidth;
        // the zoom level is always an integer percent value
        vFactor = Math.round((vPhysicalW / vLogicalW) * 100) / 100;
    }
    return vFactor;
};
exports.benchMark = function (pItem) {
    var vEndTime = new Date().getTime();
    alert(pItem + ': Elapsed time: ' + ((vEndTime - this.vBenchTime) / 1000) + ' seconds.');
    this.vBenchTime = new Date().getTime();
};
exports.getScrollPositions = function () {
    var vScrollLeft = window.pageXOffset;
    var vScrollTop = window.pageYOffset;
    if (!('pageXOffset' in window)) // Internet Explorer before version 9
     {
        var vZoomFactor = exports.getZoomFactor();
        vScrollLeft = Math.round(document.documentElement.scrollLeft / vZoomFactor);
        vScrollTop = Math.round(document.documentElement.scrollTop / vZoomFactor);
    }
    return { x: vScrollLeft, y: vScrollTop };
};
var scrollbarWidth = undefined;
exports.getScrollbarWidth = function () {
    if (scrollbarWidth)
        return scrollbarWidth;
    var outer = document.createElement('div');
    outer.className = 'gscrollbar-calculation-container';
    document.body.appendChild(outer);
    // Creating inner element and placing it in the container
    var inner = document.createElement('div');
    outer.appendChild(inner);
    // Calculating difference between container's full width and the child width
    scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
};
exports.calculateCurrentDateOffset = function (curTaskStart, curTaskEnd) {
    var tmpTaskStart = Date.UTC(curTaskStart.getFullYear(), curTaskStart.getMonth(), curTaskStart.getDate(), curTaskStart.getHours(), 0, 0);
    var tmpTaskEnd = Date.UTC(curTaskEnd.getFullYear(), curTaskEnd.getMonth(), curTaskEnd.getDate(), curTaskEnd.getHours(), 0, 0);
    return (tmpTaskEnd - tmpTaskStart);
};
exports.getOffset = function (pStartDate, pEndDate, pColWidth, pFormat, pShowWeekends) {
    var DAY_CELL_MARGIN_WIDTH = 3; // Cell margin for 'day' format
    var WEEK_CELL_MARGIN_WIDTH = 3; // Cell margin for 'week' format
    var MONTH_CELL_MARGIN_WIDTH = 3; // Cell margin for 'month' format
    var QUARTER_CELL_MARGIN_WIDTH = 3; // Cell margin for 'quarter' format
    var HOUR_CELL_MARGIN_WIDTH = 3; // Cell margin for 'hour' format
    var vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var curTaskStart = new Date(pStartDate.getTime());
    var curTaskEnd = new Date(pEndDate.getTime());
    var vTaskRightPx = 0;
    // Length of task in hours
    var oneHour = 3600000;
    var vTaskRight = exports.calculateCurrentDateOffset(curTaskStart, curTaskEnd) / oneHour;
    var vPosTmpDate;
    if (pFormat == 'day') {
        if (!pShowWeekends) {
            var start = curTaskStart;
            var end = curTaskEnd;
            var countWeekends = 0;
            while (start < end) {
                var day = start.getDay();
                if (day === 6 || day == 0) {
                    countWeekends++;
                }
                start = new Date(start.getTime() + 24 * oneHour);
            }
            vTaskRight -= countWeekends * 24;
        }
        vTaskRightPx = Math.ceil((vTaskRight / 24) * (pColWidth + DAY_CELL_MARGIN_WIDTH) - 1);
    }
    else if (pFormat == 'week') {
        vTaskRightPx = Math.ceil((vTaskRight / (24 * 7)) * (pColWidth + WEEK_CELL_MARGIN_WIDTH) - 1);
    }
    else if (pFormat == 'month') {
        var vMonthsDiff = (12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear())) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
        vPosTmpDate = new Date(curTaskEnd.getTime());
        vPosTmpDate.setDate(curTaskStart.getDate());
        var vDaysCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (86400000);
        vTaskRightPx = Math.ceil((vMonthsDiff * (pColWidth + MONTH_CELL_MARGIN_WIDTH)) + (vDaysCrctn * (pColWidth / vMonthDaysArr[curTaskEnd.getMonth()])) - 1);
    }
    else if (pFormat == 'quarter') {
        var vMonthsDiff = (12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear())) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
        vPosTmpDate = new Date(curTaskEnd.getTime());
        vPosTmpDate.setDate(curTaskStart.getDate());
        var vDaysCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (86400000);
        vTaskRightPx = Math.ceil((vMonthsDiff * ((pColWidth + QUARTER_CELL_MARGIN_WIDTH) / 3)) + (vDaysCrctn * (pColWidth / 90)) - 1);
    }
    else if (pFormat == 'hour') {
        // can't just calculate sum because of daylight savings changes
        vPosTmpDate = new Date(curTaskEnd.getTime());
        vPosTmpDate.setMinutes(curTaskStart.getMinutes(), 0);
        var vMinsCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (3600000);
        vTaskRightPx = Math.ceil((vTaskRight * (pColWidth + HOUR_CELL_MARGIN_WIDTH)) + (vMinsCrctn * (pColWidth)));
    }
    return vTaskRightPx;
};
exports.isIE = function () {
    if (typeof document.all != 'undefined') {
        if ('pageXOffset' in window)
            return false; // give IE9 and above the benefit of the doubt!
        else
            return true;
    }
    else
        return false;
};
exports.hideToolTip = function (pGanttChartObj, pTool, pTimer) {
    if (pGanttChartObj.getUseFade()) {
        clearInterval(pTool.fadeInterval);
        pTool.fadeInterval = setInterval(function () { exports.fadeToolTip(-1, pTool, 0); }, pTimer);
    }
    else {
        pTool.style.opacity = 0;
        pTool.style.filter = 'alpha(opacity=0)';
        pTool.style.visibility = 'hidden';
        pTool.vToolCont.setAttribute("showing", null);
    }
};
exports.fadeToolTip = function (pDirection, pTool, pMaxAlpha) {
    var vIncrement = parseInt(pTool.getAttribute('fadeIncrement'));
    var vAlpha = pTool.getAttribute('currentOpacity');
    var vCurAlpha = parseInt(vAlpha);
    if ((vCurAlpha != pMaxAlpha && pDirection == 1) || (vCurAlpha != 0 && pDirection == -1)) {
        var i = vIncrement;
        if (pMaxAlpha - vCurAlpha < vIncrement && pDirection == 1) {
            i = pMaxAlpha - vCurAlpha;
        }
        else if (vAlpha < vIncrement && pDirection == -1) {
            i = vCurAlpha;
        }
        vAlpha = vCurAlpha + (i * pDirection);
        pTool.style.opacity = vAlpha * 0.01;
        pTool.style.filter = 'alpha(opacity=' + vAlpha + ')';
        pTool.setAttribute('currentOpacity', vAlpha);
    }
    else {
        clearInterval(pTool.fadeInterval);
        if (pDirection == -1) {
            pTool.style.opacity = 0;
            pTool.style.filter = 'alpha(opacity=0)';
            pTool.style.visibility = 'hidden';
            pTool.vToolCont.setAttribute("showing", null);
        }
    }
};
exports.hashString = function (key) {
    if (!key) {
        key = 'default';
    }
    key += '';
    var hash = 5381;
    for (var i = 0; i < key.length; i++) {
        if (key.charCodeAt) {
            // tslint:disable-next-line:no-bitwise
            hash = (hash << 5) + hash + key.charCodeAt(i);
        }
        // tslint:disable-next-line:no-bitwise
        hash = hash & hash;
    }
    // tslint:disable-next-line:no-bitwise
    return hash >>> 0;
};
exports.hashKey = function (key) {
    return this.hashString(key);
};
exports.criticalPath = function (tasks) {
    var path = {};
    // calculate duration
    tasks.forEach(function (task) {
        task.duration = new Date(task.pEnd).getTime() - new Date(task.pStart).getTime();
    });
    tasks.forEach(function (task) {
        if (!path[task.pID]) {
            path[task.pID] = task;
        }
        if (!path[task.pParent]) {
            path[task.pParent] = {
                childrens: []
            };
        }
        if (!path[task.pID].childrens) {
            path[task.pID].childrens = [];
        }
        path[task.pParent].childrens.push(task);
        var max = path[task.pParent].childrens[0].duration;
        path[task.pParent].childrens.forEach(function (t) {
            if (t.duration > max) {
                max = t.duration;
            }
        });
        path[task.pParent].duration = max;
    });
    var finalNodes = { 0: path[0] };
    var node = path[0];
    var _loop_1 = function () {
        if (node.childrens.length > 0) {
            var found_1 = node.childrens[0];
            var max_1 = found_1.duration;
            node.childrens.forEach(function (c) {
                if (c.duration > max_1) {
                    found_1 = c;
                    max_1 = c.duration;
                }
            });
            finalNodes[found_1.pID] = found_1;
            node = found_1;
        }
        else {
            node = null;
        }
    };
    while (node) {
        _loop_1();
    }
};
function isParentElementOrSelf(child, parent) {
    while (child) {
        if (child === parent)
            return true;
        child = child.parentElement;
    }
}
exports.isParentElementOrSelf = isParentElementOrSelf;
exports.updateFlyingObj = function (e, pGanttChartObj, pTimer) {
    var documentElement = document.documentElement;
    var bodyElement = document.getElementsByTagName('body')[0];
    var vCurTopBuf = 3;
    var vCurLeftBuf = 5;
    var vCurBotBuf = 3;
    var vCurRightBuf = 15;
    var vMouseX = (e) ? e.clientX : window.event.clientX;
    var vMouseY = (e) ? e.clientY : window.event.clientY;
    var vViewportX = (documentElement === null || documentElement === void 0 ? void 0 : documentElement.clientWidth) || (bodyElement === null || bodyElement === void 0 ? void 0 : bodyElement.clientWidth);
    var vViewportY = (documentElement === null || documentElement === void 0 ? void 0 : documentElement.clientHeight) || (bodyElement === null || bodyElement === void 0 ? void 0 : bodyElement.clientHeight);
    var vNewX = vMouseX;
    var vNewY = vMouseY;
    var screenX = screen.availWidth || window.innerWidth;
    var screenY = screen.availHeight || window.innerHeight;
    var vOldX = parseInt(pGanttChartObj.vTool.style.left);
    var vOldY = parseInt(pGanttChartObj.vTool.style.top);
    if (navigator.appName.toLowerCase() == 'microsoft internet explorer') {
        // the clientX and clientY properties include the left and top borders of the client area
        vMouseX -= documentElement === null || documentElement === void 0 ? void 0 : documentElement.clientLeft;
        vMouseY -= documentElement === null || documentElement === void 0 ? void 0 : documentElement.clientTop;
        var vZoomFactor = exports.getZoomFactor();
        if (vZoomFactor != 1) { // IE 7 at non-default zoom level
            vMouseX = Math.round(vMouseX / vZoomFactor);
            vMouseY = Math.round(vMouseY / vZoomFactor);
        }
    }
    var vScrollPos = exports.getScrollPositions();
    /* Code for positioned right of the mouse by default*/
    /*
    if (vMouseX+vCurRightBuf+pGanttChartObj.vTool.offsetWidth>vViewportX)
    {
        if (vMouseX-vCurLeftBuf-pGanttChartObj.vTool.offsetWidth<0) vNewX=vScrollPos.x;
        else vNewX=vMouseX+vScrollPos.x-vCurLeftBuf-pGanttChartObj.vTool.offsetWidth;
    }
    else vNewX=vMouseX+vScrollPos.x+vCurRightBuf;
    */
    /* Code for positioned left of the mouse by default */
    if (vMouseX - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth < 0) {
        if (vMouseX + vCurRightBuf + pGanttChartObj.vTool.offsetWidth > vViewportX)
            vNewX = vScrollPos.x;
        else
            vNewX = vMouseX + vScrollPos.x + vCurRightBuf;
    }
    else
        vNewX = vMouseX + vScrollPos.x - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth;
    /* Code for positioned below the mouse by default */
    if (vMouseY + vCurBotBuf + pGanttChartObj.vTool.offsetHeight > vViewportY) {
        if (vMouseY - vCurTopBuf - pGanttChartObj.vTool.offsetHeight < 0)
            vNewY = vScrollPos.y;
        else
            vNewY = vMouseY + vScrollPos.y - vCurTopBuf - pGanttChartObj.vTool.offsetHeight;
    }
    else
        vNewY = vMouseY + vScrollPos.y + vCurBotBuf;
    /* Code for positioned above the mouse by default */
    /*
    if (vMouseY-vCurTopBuf-pGanttChartObj.vTool.offsetHeight<0)
    {
        if (vMouseY+vCurBotBuf+pGanttChartObj.vTool.offsetHeight>vViewportY) vNewY=vScrollPos.y;
        else vNewY=vMouseY+vScrollPos.y+vCurBotBuf;
    }
    else vNewY=vMouseY+vScrollPos.y-vCurTopBuf-pGanttChartObj.vTool.offsetHeight;
    */
    var outViewport = Math.abs(vOldX - vNewX) > screenX || Math.abs(vOldY - vNewY) > screenY;
    if (pGanttChartObj.getUseMove() && !outViewport) {
        clearInterval(pGanttChartObj.vTool.moveInterval);
        pGanttChartObj.vTool.moveInterval = setInterval(function () { exports.moveToolTip(vNewX, vNewY, pGanttChartObj.vTool, pTimer); }, pTimer);
    }
    else {
        pGanttChartObj.vTool.style.left = vNewX + 'px';
        pGanttChartObj.vTool.style.top = vNewY + 'px';
    }
};
exports.moveToolTip = function (pNewX, pNewY, pTool, timer) {
    var vSpeed = parseInt(pTool.getAttribute('moveSpeed'));
    var vOldX = parseInt(pTool.style.left);
    var vOldY = parseInt(pTool.style.top);
    if (pTool.style.visibility != 'visible') {
        pTool.style.left = pNewX + 'px';
        pTool.style.top = pNewY + 'px';
        clearInterval(pTool.moveInterval);
    }
    else {
        if (pNewX != vOldX && pNewY != vOldY) {
            vOldX += Math.ceil((pNewX - vOldX) / vSpeed);
            vOldY += Math.ceil((pNewY - vOldY) / vSpeed);
            pTool.style.left = vOldX + 'px';
            pTool.style.top = vOldY + 'px';
        }
        else {
            clearInterval(pTool.moveInterval);
        }
    }
};
exports.makeRequest = function (pFile, json, vDebug) {
    if (json === void 0) { json = true; }
    if (vDebug === void 0) { vDebug = false; }
    if (window.fetch) {
        var f = fetch(pFile);
        if (json) {
            return f.then(function (res) { return res.json(); });
        }
        else {
            return f;
        }
    }
    else {
        return exports.makeRequestOldBrowsers(pFile, vDebug)
            .then(function (xhttp) {
            if (json) {
                var jsonObj = JSON.parse(xhttp.response);
                return jsonObj;
            }
            else {
                var xmlDoc = xhttp.responseXML;
                return xmlDoc;
            }
        });
    }
};
exports.makeRequestOldBrowsers = function (pFile, vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    return new Promise(function (resolve, reject) {
        var bd;
        if (vDebug) {
            bd = new Date();
            console.info('before jsonparse', bd);
        }
        var xhttp;
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        }
        else { // IE 5/6
            xhttp = new window.ActiveXObject('Microsoft.XMLHTTP');
        }
        xhttp.open('GET', pFile, true);
        xhttp.send(null);
        xhttp.onload = function (e) {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    // resolve(xhttp.responseText);
                }
                else {
                    console.error(xhttp.statusText);
                }
                if (vDebug) {
                    bd = new Date();
                    console.info('before jsonparse', bd);
                }
                resolve(xhttp);
            }
        };
        xhttp.onerror = function (e) {
            reject(xhttp.statusText);
        };
    });
};
exports.calculateStartEndFromDepend = function (tasksList) {
};
exports.printChart = function (width, height, css) {
    if (css === void 0) { css = undefined; }
    if (css === undefined) {
        css = // Default injected CSS
            "@media print {\n        @page {\n          size: " + width + "mm " + height + "mm;\n        }\n        /* set gantt container to the same width as the page */\n        .gchartcontainer {\n            width: " + width + "mm;\n        }\n    };";
    }
    var $container = document.querySelector('.gchartcontainer');
    $container.insertAdjacentHTML('afterbegin', "<style>" + css + "</style>");
    // Remove the print CSS when the print dialog is closed
    window.addEventListener('afterprint', function () {
        $container.removeChild($container.children[0]);
    }, { 'once': true });
    // Trigger the print
    window.print();
};
//# sourceMappingURL=general_utils.js.map