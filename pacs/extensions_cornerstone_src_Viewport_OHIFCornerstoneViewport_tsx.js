(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([["extensions_cornerstone_src_Viewport_OHIFCornerstoneViewport_tsx"],{

/***/ "../../../extensions/cornerstone/src/Viewport/OHIFCornerstoneViewport.tsx"
/*!********************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/OHIFCornerstoneViewport.tsx ***!
  \********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @cornerstonejs/core */ "../../../node_modules/@cornerstonejs/core/dist/esm/index.js");
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ohif/core */ "../../core/src/index.ts");
/* harmony import */ var _ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ohif/ui-next */ "../../ui-next/src/index.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../state */ "../../../extensions/cornerstone/src/state.ts");
/* harmony import */ var _OHIFCornerstoneViewport_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./OHIFCornerstoneViewport.css */ "../../../extensions/cornerstone/src/Viewport/OHIFCornerstoneViewport.css");
/* harmony import */ var _OHIFCornerstoneViewport_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_OHIFCornerstoneViewport_css__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _Overlays_CornerstoneOverlays__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Overlays/CornerstoneOverlays */ "../../../extensions/cornerstone/src/Viewport/Overlays/CornerstoneOverlays.tsx");
/* harmony import */ var _components_CinePlayer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/CinePlayer */ "../../../extensions/cornerstone/src/components/CinePlayer/index.ts");
/* harmony import */ var _components_OHIFViewportActionCorners__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/OHIFViewportActionCorners */ "../../../extensions/cornerstone/src/components/OHIFViewportActionCorners.tsx");
/* harmony import */ var _utils_presentations_getViewportPresentations__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/presentations/getViewportPresentations */ "../../../extensions/cornerstone/src/utils/presentations/getViewportPresentations.ts");
/* harmony import */ var _stores_useSynchronizersStore__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../stores/useSynchronizersStore */ "../../../extensions/cornerstone/src/stores/useSynchronizersStore.ts");
/* harmony import */ var _utils_ActiveViewportBehavior__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/ActiveViewportBehavior */ "../../../extensions/cornerstone/src/utils/ActiveViewportBehavior.tsx");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");

var _s = __webpack_require__.$Refresh$.signature();












const STACK = 'stack';

// Cache for viewport dimensions, persists across component remounts
const viewportDimensions = new Map();

// Todo: This should be done with expose of internal API similar to react-vtkjs-viewport
// Then we don't need to worry about the re-renders if the props change.
const OHIFCornerstoneViewport = /*#__PURE__*/_s(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().memo(_c = _s(props => {
  _s();
  const {
    displaySets,
    dataSource,
    viewportOptions,
    displaySetOptions,
    servicesManager,
    onElementEnabled,
    // eslint-disable-next-line react/prop-types
    onElementDisabled,
    isJumpToMeasurementDisabled = false,
    // Note: you SHOULD NOT use the initialImageIdOrIndex for manipulation
    // of the imageData in the OHIFCornerstoneViewport. This prop is used
    // to set the initial state of the viewport's first image to render
    // eslint-disable-next-line react/prop-types
    initialImageIndex,
    // if the viewport is part of a hanging protocol layout
    // we should not really rely on the old synchronizers and
    // you see below we only rehydrate the synchronizers if the viewport
    // is not part of the hanging protocol layout. HPs should
    // define their own synchronizers. Since the synchronizers are
    // viewportId dependent and
    // eslint-disable-next-line react/prop-types
    isHangingProtocolLayout
  } = props;
  const viewportId = viewportOptions.viewportId;
  if (!viewportId) {
    throw new Error('Viewport ID is required');
  }

  // Make sure displaySetOptions has one object per displaySet
  while (displaySetOptions.length < displaySets.length) {
    displaySetOptions.push({});
  }

  // Since we only have support for dynamic data in volume viewports, we should
  // handle this case here and set the viewportType to volume if any of the
  // displaySets are dynamic volumes
  viewportOptions.viewportType = displaySets.some(ds => ds.isDynamicVolume && ds.isReconstructable) ? 'volume' : viewportOptions.viewportType;
  const [scrollbarHeight, setScrollbarHeight] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('100px');
  const [enabledVPElement, setEnabledVPElement] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const elementRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const viewportRef = (0,_ohif_core__WEBPACK_IMPORTED_MODULE_2__.useViewportRef)(viewportId);
  const {
    displaySetService,
    toolbarService,
    toolGroupService,
    syncGroupService,
    cornerstoneViewportService,
    segmentationService,
    cornerstoneCacheService,
    customizationService,
    measurementService
  } = servicesManager.services;
  const [viewportDialogState] = (0,_ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__.useViewportDialog)();
  // useCallback for scroll bar height calculation
  const setImageScrollBarHeight = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const scrollbarHeight = `${elementRef.current.clientHeight - 10}px`;
    setScrollbarHeight(scrollbarHeight);
  }, [elementRef]);

  // useCallback for onResize
  const onResize = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(entries => {
    if (elementRef.current && entries?.length) {
      const entry = entries[0];
      const {
        width,
        height
      } = entry.contentRect;
      const prevDimensions = viewportDimensions.get(viewportId) || {
        width: 0,
        height: 0
      };

      // Check if dimensions actually changed and then only resize if they have changed
      const hasDimensionsChanged = prevDimensions.width !== width || prevDimensions.height !== height;
      if (width > 0 && height > 0 && hasDimensionsChanged) {
        viewportDimensions.set(viewportId, {
          width,
          height
        });
        // Perform resize operations
        cornerstoneViewportService.resize();
        setImageScrollBarHeight();
      }
    }
  }, [viewportId, elementRef, cornerstoneViewportService, setImageScrollBarHeight]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(element);

    // Cleanup function
    return () => {
      resizeObserver.unobserve(element);
      resizeObserver.disconnect();
    };
  }, [onResize]);
  const cleanUpServices = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(viewportInfo => {
    const renderingEngineId = viewportInfo.getRenderingEngineId();
    const syncGroups = viewportInfo.getSyncGroups();
    toolGroupService.removeViewportFromToolGroup(viewportId, renderingEngineId);
    syncGroupService.removeViewportFromSyncGroup(viewportId, renderingEngineId, syncGroups);
    segmentationService.clearSegmentationRepresentations(viewportId);
  }, [viewportId, segmentationService, syncGroupService, toolGroupService]);
  const elementEnabledHandler = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(evt => {
    // check this is this element reference and return early if doesn't match
    if (evt.detail.element !== elementRef.current) {
      return;
    }
    const {
      viewportId,
      element
    } = evt.detail;
    const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
    if (!viewportInfo) {
      return;
    }
    (0,_state__WEBPACK_IMPORTED_MODULE_4__.setEnabledElement)(viewportId, element);
    setEnabledVPElement(element);
    const renderingEngineId = viewportInfo.getRenderingEngineId();
    const toolGroupId = viewportInfo.getToolGroupId();
    const syncGroups = viewportInfo.getSyncGroups();
    toolGroupService.addViewportToToolGroup(viewportId, renderingEngineId, toolGroupId);
    syncGroupService.addViewportToSyncGroup(viewportId, renderingEngineId, syncGroups);

    // we don't need reactivity here so just use state
    const {
      synchronizersStore
    } = _stores_useSynchronizersStore__WEBPACK_IMPORTED_MODULE_10__.useSynchronizersStore.getState();
    if (synchronizersStore?.[viewportId]?.length && !isHangingProtocolLayout) {
      // If the viewport used to have a synchronizer, re apply it again
      _rehydrateSynchronizers(viewportId, syncGroupService);
    }
    if (onElementEnabled && typeof onElementEnabled === 'function') {
      onElementEnabled(evt);
    }
  }, [viewportId, onElementEnabled, toolGroupService]);

  // disable the element upon unmounting
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    cornerstoneViewportService.enableViewport(viewportId, elementRef.current);
    _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.eventTarget.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.Events.ELEMENT_ENABLED, elementEnabledHandler);
    setImageScrollBarHeight();
    return () => {
      const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
      if (!viewportInfo) {
        return;
      }
      cornerstoneViewportService.storePresentation({
        viewportId
      });

      // This should be done after the store presentation since synchronizers
      // will get cleaned up and they need the viewportInfo to be present
      cleanUpServices(viewportInfo);
      if (onElementDisabled && typeof onElementDisabled === 'function') {
        onElementDisabled(viewportInfo);
      }
      cornerstoneViewportService.disableElement(viewportId);
      viewportRef.unregister();
      _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.eventTarget.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.Events.ELEMENT_ENABLED, elementEnabledHandler);
    };
  }, []);

  // subscribe to displaySet metadata invalidation (updates)
  // Currently, if the metadata changes we need to re-render the display set
  // for it to take effect in the viewport. As we deal with scaling in the loading,
  // we need to remove the old volume from the cache, and let the
  // viewport to re-add it which will use the new metadata. Otherwise, the
  // viewport will use the cached volume and the new metadata will not be used.
  // Note: this approach does not actually end of sending network requests
  // and it uses the network cache
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const {
      unsubscribe
    } = displaySetService.subscribe(displaySetService.EVENTS.DISPLAY_SET_SERIES_METADATA_INVALIDATED, async ({
      displaySetInstanceUID: invalidatedDisplaySetInstanceUID,
      invalidateData
    }) => {
      if (!invalidateData) {
        return;
      }
      const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
      if (viewportInfo.hasDisplaySet(invalidatedDisplaySetInstanceUID)) {
        const viewportData = viewportInfo.getViewportData();
        const newViewportData = await cornerstoneCacheService.invalidateViewportData(viewportData, invalidatedDisplaySetInstanceUID, dataSource, displaySetService);
        const keepCamera = true;
        cornerstoneViewportService.updateViewport(viewportId, newViewportData, keepCamera);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [viewportId]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // handle the default viewportType to be stack
    if (!viewportOptions.viewportType) {
      viewportOptions.viewportType = STACK;
    }
    const loadViewportData = async () => {
      const viewportData = await cornerstoneCacheService.createViewportData(displaySets, viewportOptions, dataSource, initialImageIndex);
      const presentations = (0,_utils_presentations_getViewportPresentations__WEBPACK_IMPORTED_MODULE_9__.getViewportPresentations)(viewportId, viewportOptions);

      // Note: This is a hack to get the grid to re-render the OHIFCornerstoneViewport component
      // Used for segmentation hydration right now, since the logic to decide whether
      // a viewport needs to render a segmentation lives inside the CornerstoneViewportService
      // so we need to re-render (force update via change of the needsRerendering) so that React
      // does the diffing and decides we should render this again (although the id and element has not changed)
      // so that the CornerstoneViewportService can decide whether to render the segmentation or not. Not that we reached here we can turn it off.
      if (viewportOptions.needsRerendering) {
        viewportOptions.needsRerendering = false;
      }
      cornerstoneViewportService.setViewportData(viewportId, viewportData, viewportOptions, displaySetOptions, presentations);
    };
    loadViewportData();
  }, [viewportOptions, displaySets, dataSource]);
  const Notification = customizationService.getCustomization('ui.notificationComponent');
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "viewport-wrapper"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "cornerstone-viewport-element",
    style: {
      height: '100%',
      width: '100%'
    },
    onContextMenu: e => e.preventDefault(),
    onMouseDown: e => e.preventDefault(),
    "data-viewportid": viewportId,
    ref: el => {
      elementRef.current = el;
      if (el) {
        viewportRef.register(el);
      }
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Overlays_CornerstoneOverlays__WEBPACK_IMPORTED_MODULE_6__["default"], {
    viewportId: viewportId,
    toolBarService: toolbarService,
    element: elementRef.current,
    scrollbarHeight: scrollbarHeight,
    servicesManager: servicesManager
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_CinePlayer__WEBPACK_IMPORTED_MODULE_7__["default"], {
    enabledVPElement: enabledVPElement,
    viewportId: viewportId,
    servicesManager: servicesManager
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_utils_ActiveViewportBehavior__WEBPACK_IMPORTED_MODULE_11__["default"], {
    viewportId: viewportId,
    servicesManager: servicesManager
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "absolute top-[24px] w-full"
  }, viewportDialogState.viewportId === viewportId && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Notification, {
    id: "viewport-notification",
    message: viewportDialogState.message,
    type: viewportDialogState.type,
    actions: viewportDialogState.actions,
    onSubmit: viewportDialogState.onSubmit,
    onOutsideClick: viewportDialogState.onOutsideClick,
    onKeyPress: viewportDialogState.onKeyPress
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_OHIFViewportActionCorners__WEBPACK_IMPORTED_MODULE_8__["default"], {
    viewportId: viewportId
  }));
}, "KrPInZ/QytTNd/nHUOW2R0b/yXw=", false, function () {
  return [_ohif_core__WEBPACK_IMPORTED_MODULE_2__.useViewportRef, _ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__.useViewportDialog];
}), areEqual), "KrPInZ/QytTNd/nHUOW2R0b/yXw=", false, function () {
  return [_ohif_core__WEBPACK_IMPORTED_MODULE_2__.useViewportRef, _ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__.useViewportDialog];
});
_c2 = OHIFCornerstoneViewport;
function _rehydrateSynchronizers(viewportId, syncGroupService) {
  const {
    synchronizersStore
  } = _stores_useSynchronizersStore__WEBPACK_IMPORTED_MODULE_10__.useSynchronizersStore.getState();
  const synchronizers = synchronizersStore[viewportId];
  if (!synchronizers) {
    return;
  }
  synchronizers.forEach(synchronizerObj => {
    if (!synchronizerObj.id) {
      return;
    }
    const {
      id,
      sourceViewports,
      targetViewports
    } = synchronizerObj;
    const synchronizer = syncGroupService.getSynchronizer(id);
    if (!synchronizer) {
      return;
    }
    const sourceViewportInfo = sourceViewports.find(sourceViewport => sourceViewport.viewportId === viewportId);
    const targetViewportInfo = targetViewports.find(targetViewport => targetViewport.viewportId === viewportId);
    const isSourceViewportInSynchronizer = synchronizer.getSourceViewports().find(sourceViewport => sourceViewport.viewportId === viewportId);
    const isTargetViewportInSynchronizer = synchronizer.getTargetViewports().find(targetViewport => targetViewport.viewportId === viewportId);

    // if the viewport was previously a source viewport, add it again
    if (sourceViewportInfo && !isSourceViewportInSynchronizer) {
      synchronizer.addSource({
        viewportId: sourceViewportInfo.viewportId,
        renderingEngineId: sourceViewportInfo.renderingEngineId
      });
    }

    // if the viewport was previously a target viewport, add it again
    if (targetViewportInfo && !isTargetViewportInSynchronizer) {
      synchronizer.addTarget({
        viewportId: targetViewportInfo.viewportId,
        renderingEngineId: targetViewportInfo.renderingEngineId
      });
    }
  });
}

// Component displayName
OHIFCornerstoneViewport.displayName = 'OHIFCornerstoneViewport';
function areEqual(prevProps, nextProps) {
  if (nextProps.needsRerendering) {
    return false;
  }
  if (prevProps.displaySets.length !== nextProps.displaySets.length) {
    return false;
  }
  if (prevProps.viewportOptions.orientation !== nextProps.viewportOptions.orientation) {
    return false;
  }
  if (prevProps.viewportOptions.toolGroupId !== nextProps.viewportOptions.toolGroupId) {
    return false;
  }
  if (nextProps.viewportOptions.viewportType && prevProps.viewportOptions.viewportType !== nextProps.viewportOptions.viewportType) {
    return false;
  }
  if (nextProps.viewportOptions.needsRerendering) {
    return false;
  }
  const prevDisplaySets = prevProps.displaySets;
  const nextDisplaySets = nextProps.displaySets;
  if (prevDisplaySets.length !== nextDisplaySets.length) {
    return false;
  }
  for (let i = 0; i < prevDisplaySets.length; i++) {
    const prevDisplaySet = prevDisplaySets[i];
    const foundDisplaySet = nextDisplaySets.find(nextDisplaySet => nextDisplaySet.displaySetInstanceUID === prevDisplaySet.displaySetInstanceUID);
    if (!foundDisplaySet) {
      return false;
    }

    // check they contain the same image
    if (foundDisplaySet.images?.length !== prevDisplaySet.images?.length) {
      return false;
    }

    // check if their imageIds are the same
    if (foundDisplaySet.images?.length) {
      for (let j = 0; j < foundDisplaySet.images.length; j++) {
        if (foundDisplaySet.images[j].imageId !== prevDisplaySet.images[j].imageId) {
          return false;
        }
      }
    }
  }
  return true;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OHIFCornerstoneViewport);
var _c, _c2;
__webpack_require__.$Refresh$.register(_c, "OHIFCornerstoneViewport$React.memo");
__webpack_require__.$Refresh$.register(_c2, "OHIFCornerstoneViewport");

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/Viewport/Overlays/CornerstoneOverlays.tsx"
/*!*************************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/Overlays/CornerstoneOverlays.tsx ***!
  \*************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ViewportImageScrollbar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewportImageScrollbar */ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportImageScrollbar.tsx");
/* harmony import */ var _ViewportSliceProgressScrollbar_ViewportSliceProgressScrollbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ViewportSliceProgressScrollbar/ViewportSliceProgressScrollbar */ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportSliceProgressScrollbar/ViewportSliceProgressScrollbar.tsx");
/* harmony import */ var _CustomizableViewportOverlay__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CustomizableViewportOverlay */ "../../../extensions/cornerstone/src/Viewport/Overlays/CustomizableViewportOverlay.tsx");
/* harmony import */ var _ViewportOrientationMarkers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ViewportOrientationMarkers */ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportOrientationMarkers.tsx");
/* harmony import */ var _ViewportImageSliceLoadingIndicator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ViewportImageSliceLoadingIndicator */ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportImageSliceLoadingIndicator.tsx");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");

var _s = __webpack_require__.$Refresh$.signature();






function CornerstoneOverlays(props) {
  _s();
  const {
    viewportId,
    element,
    scrollbarHeight,
    servicesManager
  } = props;
  const {
    cornerstoneViewportService,
    customizationService
  } = servicesManager.services;
  const [imageSliceData, setImageSliceData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    imageIndex: 0,
    numberOfSlices: 0
  });
  const [viewportData, setViewportData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const {
      unsubscribe
    } = cornerstoneViewportService.subscribe(cornerstoneViewportService.EVENTS.VIEWPORT_DATA_CHANGED, props => {
      if (props.viewportId !== viewportId) {
        return;
      }
      setViewportData(props.viewportData);
    });
    return () => {
      unsubscribe();
    };
  }, [viewportId]);
  if (!element) {
    return null;
  }
  if (viewportData) {
    const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
    if (viewportInfo?.viewportOptions?.customViewportProps?.hideOverlays) {
      return null;
    }
  }
  const viewportScrollbarVariant = customizationService.getCustomization('viewportScrollbar.variant');
  const useProgressScrollbar = viewportScrollbarVariant !== 'legacy';
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "noselect"
  }, useProgressScrollbar ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ViewportSliceProgressScrollbar_ViewportSliceProgressScrollbar__WEBPACK_IMPORTED_MODULE_2__["default"], {
    viewportId: viewportId,
    viewportData: viewportData,
    element: element,
    imageSliceData: imageSliceData,
    setImageSliceData: setImageSliceData,
    servicesManager: servicesManager
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ViewportImageScrollbar__WEBPACK_IMPORTED_MODULE_1__["default"], {
    viewportId: viewportId,
    viewportData: viewportData,
    element: element,
    imageSliceData: imageSliceData,
    setImageSliceData: setImageSliceData,
    scrollbarHeight: scrollbarHeight,
    servicesManager: servicesManager
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_CustomizableViewportOverlay__WEBPACK_IMPORTED_MODULE_3__["default"], {
    imageSliceData: imageSliceData,
    viewportData: viewportData,
    viewportId: viewportId,
    servicesManager: servicesManager,
    element: element
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ViewportImageSliceLoadingIndicator__WEBPACK_IMPORTED_MODULE_5__["default"], {
    viewportData: viewportData,
    element: element
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ViewportOrientationMarkers__WEBPACK_IMPORTED_MODULE_4__["default"], {
    imageSliceData: imageSliceData,
    element: element,
    viewportData: viewportData,
    servicesManager: servicesManager,
    viewportId: viewportId
  }));
}
_s(CornerstoneOverlays, "7y4R8Q5uzdtKJyb5WwOhOhBbbr0=");
_c = CornerstoneOverlays;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CornerstoneOverlays);
var _c;
__webpack_require__.$Refresh$.register(_c, "CornerstoneOverlays");

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/Viewport/Overlays/CustomizableViewportOverlay.tsx"
/*!*********************************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/Overlays/CustomizableViewportOverlay.tsx ***!
  \*********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomizableViewportOverlay: () => (/* binding */ CustomizableViewportOverlay),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix */ "../../../node_modules/gl-matrix/esm/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "../../../node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @cornerstonejs/core */ "../../../node_modules/@cornerstonejs/core/dist/esm/index.js");
/* harmony import */ var _cornerstonejs_tools__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @cornerstonejs/tools */ "../../../node_modules/@cornerstonejs/tools/dist/esm/index.js");
/* harmony import */ var _ohif_ui_next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ohif/ui-next */ "../../ui-next/src/index.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils */ "../../../extensions/cornerstone/src/Viewport/Overlays/utils.ts");
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ohif/core */ "../../core/src/index.ts");
/* harmony import */ var _CustomizableViewportOverlay_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./CustomizableViewportOverlay.css */ "../../../extensions/cornerstone/src/Viewport/Overlays/CustomizableViewportOverlay.css");
/* harmony import */ var _CustomizableViewportOverlay_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_CustomizableViewportOverlay_css__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks */ "../../../extensions/cornerstone/src/hooks/index.ts");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");

var _s = __webpack_require__.$Refresh$.signature();










const EPSILON = 1e-4;
const {
  formatPN
} = _ohif_core__WEBPACK_IMPORTED_MODULE_7__.utils;
const OverlayItemComponents = {
  'ohif.overlayItem': OverlayItem,
  'ohif.overlayItem.windowLevel': VOIOverlayItem,
  'ohif.overlayItem.zoomLevel': ZoomOverlayItem,
  'ohif.overlayItem.instanceNumber': InstanceNumberOverlayItem
};

/**
 * Customizable Viewport Overlay
 */
function CustomizableViewportOverlay({
  element,
  viewportData,
  imageSliceData,
  viewportId,
  servicesManager
}) {
  _s();
  const {
    cornerstoneViewportService,
    customizationService,
    toolGroupService,
    displaySetService
  } = servicesManager.services;
  const [scale, setScale] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [annotationState, setAnnotationState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const {
    isViewportBackgroundLight: isLight,
    windowLevel: voi
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_9__.useViewportRendering)(viewportId);
  const {
    imageIndex
  } = imageSliceData;

  // Historical usage defined the overlays as separate items due to lack of
  // append functionality.  This code enables the historical usage, but
  // the recommended functionality is to append to the default values in
  // cornerstoneOverlay rather than defining individual items.
  const topLeftCustomization = customizationService.getCustomization('viewportOverlay.topLeft');
  const topRightCustomization = customizationService.getCustomization('viewportOverlay.topRight');
  const bottomLeftCustomization = customizationService.getCustomization('viewportOverlay.bottomLeft');
  const bottomRightCustomization = customizationService.getCustomization('viewportOverlay.bottomRight');
  const instanceNumber = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => viewportData ? getInstanceNumber(viewportData, viewportId, imageIndex, cornerstoneViewportService) : null, [viewportData, viewportId, imageIndex, cornerstoneViewportService]);
  const displaySetProps = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const displaySets = getDisplaySets(viewportData, displaySetService);
    if (!displaySets) {
      return null;
    }
    const [displaySet] = displaySets;
    const {
      instances,
      instance: referenceInstance
    } = displaySet;
    return {
      displaySets,
      displaySet,
      instance: instances?.[imageIndex],
      instances,
      referenceInstance
    };
  }, [viewportData, viewportId, instanceNumber, cornerstoneViewportService]);
  const annotationModified = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(evt => {
    if (evt.detail.annotation.metadata.toolName === _cornerstonejs_tools__WEBPACK_IMPORTED_MODULE_4__.UltrasoundPleuraBLineTool.toolName) {
      // Update the annotation state to trigger a re-render
      setAnnotationState(prevState => prevState + 1);
    }
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.eventTarget.addEventListener(_cornerstonejs_tools__WEBPACK_IMPORTED_MODULE_4__.Enums.Events.ANNOTATION_MODIFIED, annotationModified);
    return () => {
      _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.eventTarget.removeEventListener(_cornerstonejs_tools__WEBPACK_IMPORTED_MODULE_4__.Enums.Events.ANNOTATION_MODIFIED, annotationModified);
    };
  }, [annotationModified]);
  /**
   * Updating the scale when the viewport changes its zoom
   */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const updateScale = eventDetail => {
      const {
        previousCamera,
        camera
      } = eventDetail.detail;
      if (previousCamera.parallelScale !== camera.parallelScale || previousCamera.scale !== camera.scale) {
        const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
        if (!viewport) {
          return;
        }
        const scale = viewport.getZoom();
        setScale(scale);
      }
    };
    element.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.Enums.Events.CAMERA_MODIFIED, updateScale);
    return () => {
      element.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.Enums.Events.CAMERA_MODIFIED, updateScale);
    };
  }, [viewportId, viewportData, cornerstoneViewportService, element]);
  const _renderOverlayItem = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((item, props) => {
    const overlayItemProps = {
      ...props,
      element,
      viewportData,
      imageSliceData,
      viewportId,
      servicesManager,
      customization: item,
      isLight,
      formatters: {
        formatPN,
        formatDate: _ohif_ui_next__WEBPACK_IMPORTED_MODULE_5__.formatDICOMDate,
        formatTime: _utils__WEBPACK_IMPORTED_MODULE_6__.formatDICOMTime,
        formatNumberPrecision: _utils__WEBPACK_IMPORTED_MODULE_6__.formatNumberPrecision
      }
    };
    if (!item) {
      return null;
    }
    const {
      inheritsFrom
    } = item;
    const OverlayItemComponent = OverlayItemComponents[inheritsFrom];
    if (OverlayItemComponent) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(OverlayItemComponent, overlayItemProps);
    } else {
      const renderItem = customizationService.transform(item);
      if (typeof renderItem.contentF === 'function') {
        return renderItem.contentF(overlayItemProps);
      }
    }
  }, [element, viewportData, imageSliceData, viewportId, servicesManager, customizationService, displaySetProps, voi, scale, instanceNumber, annotationState, isLight]);
  const getContent = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((customization, keyPrefix) => {
    const props = {
      ...displaySetProps,
      formatters: {
        formatDate: _ohif_ui_next__WEBPACK_IMPORTED_MODULE_5__.formatDICOMDate
      },
      voi,
      scale,
      instanceNumber,
      viewportId,
      toolGroupService,
      isLight
    };
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, customization.map((item, index) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      key: `${keyPrefix}_${index}`
    }, (!item?.condition || item.condition(props)) && _renderOverlayItem(item, props) || null)));
  }, [_renderOverlayItem]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_5__.ViewportOverlay, {
    topLeft: getContent(topLeftCustomization, 'topLeftOverlayItem'),
    topRight: getContent(topRightCustomization, 'topRightOverlayItem'),
    bottomLeft: getContent(bottomLeftCustomization, 'bottomLeftOverlayItem'),
    bottomRight: getContent(bottomRightCustomization, 'bottomRightOverlayItem'),
    color: isLight ? 'text-neutral-dark' : 'text-neutral-light',
    shadowClass: isLight ? 'shadow-light' : 'shadow-dark'
  });
}

/**
 * Gets an array of display sets for the given viewport, based on the viewport data.
 * Returns null if none found.
 */
_s(CustomizableViewportOverlay, "FtA4v4+zNh87iUk2DLN4qPbiGCA=", false, function () {
  return [_hooks__WEBPACK_IMPORTED_MODULE_9__.useViewportRendering];
});
_c = CustomizableViewportOverlay;
function getDisplaySets(viewportData, displaySetService) {
  if (!viewportData?.data?.length) {
    return null;
  }
  const displaySets = viewportData.data.map(datum => displaySetService.getDisplaySetByUID(datum.displaySetInstanceUID)).filter(it => !!it);
  if (!displaySets.length) {
    return null;
  }
  return displaySets;
}
const getInstanceNumber = (viewportData, viewportId, imageIndex, cornerstoneViewportService) => {
  let instanceNumber;
  switch (viewportData.viewportType) {
    case _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.Enums.ViewportType.STACK:
      instanceNumber = _getInstanceNumberFromStack(viewportData, imageIndex);
      break;
    case _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.Enums.ViewportType.ORTHOGRAPHIC:
      instanceNumber = _getInstanceNumberFromVolume(viewportData, viewportId, cornerstoneViewportService, imageIndex);
      break;
  }
  return instanceNumber ?? null;
};
function _getInstanceNumberFromStack(viewportData, imageIndex) {
  const imageIds = viewportData.data[0].imageIds;
  const imageId = imageIds[imageIndex];
  if (!imageId) {
    return;
  }
  const generalImageModule = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.metaData.get('generalImageModule', imageId) || {};
  const {
    instanceNumber
  } = generalImageModule;
  const stackSize = imageIds.length;
  if (stackSize <= 1) {
    return;
  }
  return parseInt(instanceNumber);
}

// Since volume viewports can be in any view direction, they can render
// a reconstructed image which don't have imageIds; therefore, no instance and instanceNumber
// Here we check if viewport is in the acquisition direction and if so, we get the instanceNumber
function _getInstanceNumberFromVolume(viewportData, viewportId, cornerstoneViewportService, imageIndex) {
  const volumes = viewportData.data;
  if (!volumes) {
    return;
  }

  // Todo: support fusion of acquisition plane which has instanceNumber
  const {
    volume
  } = volumes[0];
  if (!volume) {
    return;
  }
  const {
    direction,
    imageIds
  } = volume;
  const cornerstoneViewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
  if (!cornerstoneViewport) {
    return;
  }
  const camera = cornerstoneViewport.getCamera();
  const {
    viewPlaneNormal
  } = camera;
  // checking if camera is looking at the acquisition plane (defined by the direction on the volume)

  const scanAxisNormal = direction.slice(6, 9);

  // check if viewPlaneNormal is parallel to scanAxisNormal
  const cross = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.cross(gl_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.create(), viewPlaneNormal, scanAxisNormal);
  const isAcquisitionPlane = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.vec3.length(cross) < EPSILON;
  if (isAcquisitionPlane) {
    const imageId = imageIds[imageIndex];
    if (!imageId) {
      return {};
    }
    const {
      instanceNumber
    } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.metaData.get('generalImageModule', imageId) || {};
    return parseInt(instanceNumber);
  }
}
function OverlayItem(props) {
  const {
    instance,
    customization = {}
  } = props;
  const {
    color,
    attribute,
    title,
    label,
    background
  } = customization;
  const value = customization.contentF?.(props, customization) ?? instance?.[attribute];
  if (value === undefined || value === null) {
    return null;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "overlay-item flex flex-row",
    style: {
      color,
      background
    },
    title: title
  }, label ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "mr-1 shrink-0"
  }, label) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "ml-0 shrink-0"
  }, value));
}

/**
 * Window Level / Center Overlay item
 * //
 */
_c2 = OverlayItem;
function VOIOverlayItem({
  voi,
  customization
}) {
  const {
    windowWidth,
    windowCenter
  } = voi;
  const {
    title
  } = customization;
  if (typeof windowCenter !== 'number' || typeof windowWidth !== 'number') {
    return null;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "overlay-item flex flex-row",
    style: {
      color: customization?.color
    },
    title: title
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "mr-0.5 shrink-0 opacity-[0.70]"
  }, "W:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "mr-2.5 shrink-0"
  }, windowWidth.toFixed(0)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "mr-0.5 shrink-0 opacity-[0.70]"
  }, "L:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "shrink-0"
  }, windowCenter.toFixed(0)));
}

/**
 * Zoom Level Overlay item
 */
_c3 = VOIOverlayItem;
function ZoomOverlayItem({
  scale,
  customization
}) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "overlay-item flex flex-row",
    style: {
      color: customization && customization.color || undefined
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "mr-0.5 shrink-0 opacity-[0.70]"
  }, "Zoom:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, scale.toFixed(2), "x"));
}

/**
 * Instance Number Overlay Item
 */
_c4 = ZoomOverlayItem;
function InstanceNumberOverlayItem({
  instanceNumber,
  imageSliceData,
  customization
}) {
  const {
    imageIndex,
    numberOfSlices
  } = imageSliceData;
  const {
    title
  } = customization;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "overlay-item flex flex-row",
    style: {
      color: customization && customization.color || undefined
    },
    title: title
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, instanceNumber !== undefined && instanceNumber !== null ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "mr-0.5 shrink-0 opacity-[0.70]"
  }, "I:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, `${instanceNumber} (${imageIndex + 1}/${numberOfSlices})`)) : `${imageIndex + 1}/${numberOfSlices}`));
}
_c5 = InstanceNumberOverlayItem;
CustomizableViewportOverlay.propTypes = {
  viewportData: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object),
  imageIndex: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number),
  viewportId: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CustomizableViewportOverlay);

var _c, _c2, _c3, _c4, _c5;
__webpack_require__.$Refresh$.register(_c, "CustomizableViewportOverlay");
__webpack_require__.$Refresh$.register(_c2, "OverlayItem");
__webpack_require__.$Refresh$.register(_c3, "VOIOverlayItem");
__webpack_require__.$Refresh$.register(_c4, "ZoomOverlayItem");
__webpack_require__.$Refresh$.register(_c5, "InstanceNumberOverlayItem");

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportImageScrollbar.tsx"
/*!****************************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/Overlays/ViewportImageScrollbar.tsx ***!
  \****************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "../../../node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @cornerstonejs/core */ "../../../node_modules/@cornerstonejs/core/dist/esm/index.js");
/* harmony import */ var _ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ohif/ui-next */ "../../ui-next/src/index.ts");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");

var _s = __webpack_require__.$Refresh$.signature();




function CornerstoneImageScrollbar({
  viewportData,
  viewportId,
  element,
  imageSliceData,
  setImageSliceData,
  scrollbarHeight,
  servicesManager
}) {
  _s();
  const {
    cineService,
    cornerstoneViewportService
  } = servicesManager.services;
  const onImageScrollbarChange = (imageIndex, viewportId) => {
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    const {
      isCineEnabled
    } = cineService.getState();
    if (isCineEnabled) {
      // on image scrollbar change, stop the CINE if it is playing
      cineService.stopClip(element, {
        viewportId
      });
      cineService.setCine({
        id: viewportId,
        isPlaying: false
      });
    }
    _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.utilities.jumpToSlice(viewport.element, {
      imageIndex,
      debounceLoading: true
    });
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!viewportData) {
      return;
    }
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!viewport || viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.VolumeViewport3D) {
      return;
    }
    try {
      const imageIndex = viewport.getCurrentImageIdIndex();
      const numberOfSlices = viewport.getNumberOfSlices();
      setImageSliceData({
        imageIndex: imageIndex,
        numberOfSlices
      });
    } catch (error) {
      console.warn(error);
    }
  }, [viewportId, viewportData]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!viewportData) {
      return;
    }
    const {
      viewportType
    } = viewportData;
    const eventId = viewportType === _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.ViewportType.STACK && _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.STACK_NEW_IMAGE || viewportType === _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.ViewportType.ORTHOGRAPHIC && _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.VOLUME_NEW_IMAGE || _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.IMAGE_RENDERED;
    const updateIndex = event => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport || viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.VolumeViewport3D) {
        return;
      }
      const {
        imageIndex,
        newImageIdIndex = imageIndex,
        imageIdIndex
      } = event.detail;
      const numberOfSlices = viewport.getNumberOfSlices();
      // find the index of imageId in the imageIds
      setImageSliceData({
        imageIndex: newImageIdIndex ?? imageIdIndex,
        numberOfSlices
      });
    };
    element.addEventListener(eventId, updateIndex);
    return () => {
      element.removeEventListener(eventId, updateIndex);
    };
  }, [viewportData, element]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__.ImageScrollbar, {
    onChange: evt => onImageScrollbarChange(evt, viewportId),
    max: imageSliceData.numberOfSlices ? imageSliceData.numberOfSlices - 1 : 0,
    height: scrollbarHeight,
    value: imageSliceData.imageIndex || 0
  });
}
_s(CornerstoneImageScrollbar, "3ubReDTFssvu4DHeldAg55cW/CI=");
_c = CornerstoneImageScrollbar;
CornerstoneImageScrollbar.propTypes = {
  viewportData: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object),
  viewportId: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string).isRequired,
  element: prop_types__WEBPACK_IMPORTED_MODULE_1___default().instanceOf(Element),
  scrollbarHeight: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  imageSliceData: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object).isRequired,
  setImageSliceData: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func).isRequired,
  servicesManager: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object).isRequired
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CornerstoneImageScrollbar);
var _c;
__webpack_require__.$Refresh$.register(_c, "CornerstoneImageScrollbar");

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportImageSliceLoadingIndicator.tsx"
/*!****************************************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/Overlays/ViewportImageSliceLoadingIndicator.tsx ***!
  \****************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "../../../node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @cornerstonejs/core */ "../../../node_modules/@cornerstonejs/core/dist/esm/index.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");

var _s = __webpack_require__.$Refresh$.signature();



function ViewportImageSliceLoadingIndicator({
  viewportData,
  element
}) {
  _s();
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const loadIndicatorRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const imageIdToBeLoaded = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const setLoadingState = evt => {
    clearTimeout(loadIndicatorRef.current);
    loadIndicatorRef.current = setTimeout(() => {
      setLoading(true);
    }, 50);
  };
  const setFinishLoadingState = evt => {
    clearTimeout(loadIndicatorRef.current);
    setLoading(false);
  };
  const setErrorState = evt => {
    clearTimeout(loadIndicatorRef.current);
    if (imageIdToBeLoaded.current === evt.detail.imageId) {
      setError(evt.detail.error);
      imageIdToBeLoaded.current = null;
    }
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    element.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.STACK_VIEWPORT_SCROLL, setLoadingState);
    element.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.IMAGE_LOAD_ERROR, setErrorState);
    element.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.STACK_NEW_IMAGE, setFinishLoadingState);
    return () => {
      element.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.STACK_VIEWPORT_SCROLL, setLoadingState);
      element.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.STACK_NEW_IMAGE, setFinishLoadingState);
      element.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.IMAGE_LOAD_ERROR, setErrorState);
    };
  }, [element, viewportData]);
  if (error) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "absolute top-0 left-0 h-full w-full bg-black opacity-50"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "transparent flex h-full w-full items-center justify-center"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
      className: "text-highlight text-xl font-light"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h4", null, "Error Loading Image"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "An error has occurred."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, error)))));
  }
  if (loading) {
    return (/*#__PURE__*/
      // IMPORTANT: we need to use the pointer-events-none class to prevent the loading indicator from
      // interacting with the mouse, since scrolling should propagate to the viewport underneath
      react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "pointer-events-none absolute top-0 left-0 h-full w-full bg-black opacity-50"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "transparent flex h-full w-full items-center justify-center"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
        className: "text-highlight text-xl font-light"
      }, "Loading...")))
    );
  }
  return null;
}
_s(ViewportImageSliceLoadingIndicator, "wmzvmDz6U27GCrinWCqhxix/R8w=");
_c = ViewportImageSliceLoadingIndicator;
ViewportImageSliceLoadingIndicator.propTypes = {
  error: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object),
  element: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ViewportImageSliceLoadingIndicator);
var _c;
__webpack_require__.$Refresh$.register(_c, "ViewportImageSliceLoadingIndicator");

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportOrientationMarkers.tsx"
/*!********************************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/Overlays/ViewportOrientationMarkers.tsx ***!
  \********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "../../../node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @cornerstonejs/core */ "../../../node_modules/@cornerstonejs/core/dist/esm/index.js");
/* harmony import */ var _cornerstonejs_tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @cornerstonejs/tools */ "../../../node_modules/@cornerstonejs/tools/dist/esm/index.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! gl-matrix */ "../../../node_modules/gl-matrix/esm/index.js");
/* harmony import */ var _ViewportOrientationMarkers_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ViewportOrientationMarkers.css */ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportOrientationMarkers.css");
/* harmony import */ var _ViewportOrientationMarkers_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_ViewportOrientationMarkers_css__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks */ "../../../extensions/cornerstone/src/hooks/index.ts");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");

var _s = __webpack_require__.$Refresh$.signature();







const {
  getOrientationStringLPS,
  invertOrientationStringLPS
} = _cornerstonejs_tools__WEBPACK_IMPORTED_MODULE_3__.utilities.orientation;
function ViewportOrientationMarkers({
  element,
  viewportData,
  imageSliceData,
  viewportId,
  servicesManager,
  orientationMarkers = ['top', 'left']
}) {
  _s();
  const [cameraModifiedTime, setCameraModifiedTime] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const {
    isViewportBackgroundLight: isLight
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_6__.useViewportRendering)(viewportId);
  const {
    cornerstoneViewportService
  } = servicesManager.services;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const cameraModifiedListener = () => setCameraModifiedTime(Date.now());
    element.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.CAMERA_MODIFIED, cameraModifiedListener);
    return () => {
      element.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.CAMERA_MODIFIED, cameraModifiedListener);
    };
  }, [element]);
  const markers = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!viewportData || cameraModifiedTime === 0) {
      return '';
    }
    if (!element || !(0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.getEnabledElement)(element)) {
      console.log(`ViewportOrientationMarkers :: Viewport element not enabled (${viewportId})`);
      return '';
    }
    const ohifViewport = cornerstoneViewportService.getViewportInfo(viewportId);
    if (!ohifViewport) {
      console.log(`ViewportOrientationMarkers :: No viewport (${viewportId})`);
      return '';
    }
    if (viewportData.viewportType === 'stack') {
      const imageIndex = imageSliceData.imageIndex;
      const imageId = viewportData.data[0].imageIds?.[imageIndex];

      // Workaround for below TODO stub
      if (!imageId) {
        return false;
      }
      const {
        isDefaultValueSetForRowCosine,
        isDefaultValueSetForColumnCosine
      } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.metaData.get('imagePlaneModule', imageId) || {};
      if (isDefaultValueSetForColumnCosine || isDefaultValueSetForRowCosine) {
        return '';
      }
    }
    const {
      viewport
    } = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.getEnabledElement)(element);
    const p00 = viewport.canvasToWorld([0, 0]);
    const p10 = viewport.canvasToWorld([1, 0]);
    const p01 = viewport.canvasToWorld([0, 1]);
    const rowCosines = gl_matrix__WEBPACK_IMPORTED_MODULE_4__.vec3.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_4__.vec3.create(), p10, p00);
    const columnCosines = gl_matrix__WEBPACK_IMPORTED_MODULE_4__.vec3.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_4__.vec3.create(), p01, p00);
    gl_matrix__WEBPACK_IMPORTED_MODULE_4__.vec3.normalize(rowCosines, rowCosines);
    gl_matrix__WEBPACK_IMPORTED_MODULE_4__.vec3.normalize(columnCosines, columnCosines);
    const markers = _getOrientationMarkers(rowCosines, columnCosines);
    return orientationMarkers.map((m, index) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('overlay-text', `${m}-mid orientation-marker`, isLight ? 'text-neutral-dark/70' : 'text-neutral-light/70', isLight ? 'shadow-light' : 'shadow-dark', 'text-base', 'leading-5'),
      key: `${m}-mid orientation-marker`
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "orientation-marker-value"
    }, markers[m])));
  }, [viewportData, imageSliceData, cameraModifiedTime, orientationMarkers, element, isLight]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "ViewportOrientationMarkers select-none"
  }, markers);
}

/**
 *
 * Computes the orientation labels on a Cornerstone-enabled Viewport element
 * when the viewport settings change (e.g. when a horizontal flip or a rotation occurs)
 *
 * @param {*} rowCosines
 * @param {*} columnCosines
 */
_s(ViewportOrientationMarkers, "CKyC2dhMU8P6ypqtvPdvDeAY1cY=", false, function () {
  return [_hooks__WEBPACK_IMPORTED_MODULE_6__.useViewportRendering];
});
_c = ViewportOrientationMarkers;
function _getOrientationMarkers(rowCosines, columnCosines) {
  const rowString = getOrientationStringLPS(rowCosines);
  const columnString = getOrientationStringLPS(columnCosines);
  const oppositeRowString = invertOrientationStringLPS(rowString);
  const oppositeColumnString = invertOrientationStringLPS(columnString);
  const markers = {
    top: oppositeColumnString,
    left: oppositeRowString,
    right: rowString,
    bottom: columnString
  };
  return markers;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ViewportOrientationMarkers);
var _c;
__webpack_require__.$Refresh$.register(_c, "ViewportOrientationMarkers");

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportSliceProgressScrollbar/ViewportSliceProgressScrollbar.tsx"
/*!*******************************************************************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/Overlays/ViewportSliceProgressScrollbar/ViewportSliceProgressScrollbar.tsx ***!
  \*******************************************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "../../../node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @cornerstonejs/core */ "../../../node_modules/@cornerstonejs/core/dist/esm/index.js");
/* harmony import */ var _ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ohif/ui-next */ "../../ui-next/src/index.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers */ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportSliceProgressScrollbar/helpers.ts");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hooks */ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportSliceProgressScrollbar/hooks.ts");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");

var _s = __webpack_require__.$Refresh$.signature();






function ViewportSliceProgressScrollbar({
  viewportData,
  viewportId,
  element,
  imageSliceData,
  setImageSliceData,
  servicesManager
}) {
  _s();
  const {
    cineService,
    cornerstoneViewportService,
    customizationService,
    viewedDataService
  } = servicesManager.services;
  const showLoadedEndpoints = customizationService.getCustomization('viewportScrollbar.showLoadedEndpoints') !== false;
  const showLoadedFill = customizationService.getCustomization('viewportScrollbar.showLoadedFill') !== false;
  const showViewedFill = customizationService.getCustomization('viewportScrollbar.showViewedFill') !== false;
  const showLoadingPattern = customizationService.getCustomization('viewportScrollbar.showLoadingPattern') !== false;
  const viewedDwellMsRaw = customizationService.getCustomization('viewportScrollbar.viewedDwellMs');
  const loadedBatchIntervalMsRaw = customizationService.getCustomization('viewportScrollbar.loadedBatchIntervalMs');
  const viewedDwellMs = typeof viewedDwellMsRaw === 'number' && viewedDwellMsRaw >= 0 ? viewedDwellMsRaw : 0;
  const loadedBatchIntervalMs = typeof loadedBatchIntervalMsRaw === 'number' && loadedBatchIntervalMsRaw >= 0 ? loadedBatchIntervalMsRaw : 200;
  const {
    numberOfSlices,
    imageIndex
  } = imageSliceData;
  const imageIds = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.getViewportImageIds)(viewportData), [viewportData]);
  const imageIdToIndex = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const map = new Map();
    for (let i = 0; i < imageIds.length; i++) {
      const imageId = imageIds[i];
      if (imageId) {
        map.set(imageId, i);
      }
    }
    return map;
  }, [imageIds]);
  const isFullMode = (0,_hooks__WEBPACK_IMPORTED_MODULE_5__.useProgressScrollbarMode)({
    viewportData,
    viewportId,
    element,
    cornerstoneViewportService
  });
  (0,_hooks__WEBPACK_IMPORTED_MODULE_5__.useViewportSliceSync)({
    viewportData,
    viewportId,
    element,
    cornerstoneViewportService,
    setImageSliceData
  });
  const {
    bytes: loadedBytes,
    version: loadedVersion,
    isFull: isFullyLoaded
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_5__.useLoadedSliceBytes)({
    isFullMode,
    numberOfSlices,
    viewportData,
    imageIds,
    imageIdToIndex,
    loadedBatchIntervalMs
  });
  const {
    bytes: viewedBytes,
    version: viewedVersion
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_5__.useViewedSliceBytes)({
    isFullMode,
    numberOfSlices,
    imageIndex,
    imageIds,
    imageIdToIndex,
    viewedDwellMs,
    viewedDataService
  });
  const onScrollbarValueChange = targetImageIndex => {
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!viewport || viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.VolumeViewport3D) {
      return;
    }
    const {
      isCineEnabled
    } = cineService.getState();
    if (isCineEnabled) {
      cineService.stopClip(element, {
        viewportId
      });
      cineService.setCine({
        id: viewportId,
        frameRate: undefined,
        isPlaying: false
      });
    }
    _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.utilities.jumpToSlice(viewport.element, {
      imageIndex: targetImageIndex,
      debounceLoading: true
    });
  };
  const isLoading = isFullMode && showLoadingPattern ? !isFullyLoaded : false;
  if (!numberOfSlices || numberOfSlices <= 1) {
    return null;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      height: '100%',
      padding: '8px 5px',
      zIndex: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      width: '11px'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__.SmartScrollbar, {
    className: "absolute inset-0",
    value: imageIndex || 0,
    total: numberOfSlices,
    onValueChange: onScrollbarValueChange,
    isLoading: isLoading,
    enableKeyboardNavigation: false,
    "aria-label": "Image navigation scrollbar",
    indicator: customizationService.getCustomization('viewportScrollbar.indicator')
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__.SmartScrollbarTrack, null, isFullMode && showLoadedFill && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__.SmartScrollbarFill, {
    marked: loadedBytes,
    version: loadedVersion,
    className: "bg-neutral/25",
    loadingClassName: "bg-neutral/50"
  }), isFullMode && showViewedFill && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__.SmartScrollbarFill, {
    marked: viewedBytes,
    version: viewedVersion,
    className: "bg-primary/35",
    loadingClassName: "bg-primary/35"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__.SmartScrollbarIndicator, null), isFullMode && showLoadedEndpoints && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_3__.SmartScrollbarEndpoints, {
    marked: loadedBytes,
    version: loadedVersion
  }))));
}
_s(ViewportSliceProgressScrollbar, "zMo2vO5Pgt46xf5M+ZtBZEsxsQM=", false, function () {
  return [_hooks__WEBPACK_IMPORTED_MODULE_5__.useProgressScrollbarMode, _hooks__WEBPACK_IMPORTED_MODULE_5__.useViewportSliceSync, _hooks__WEBPACK_IMPORTED_MODULE_5__.useLoadedSliceBytes, _hooks__WEBPACK_IMPORTED_MODULE_5__.useViewedSliceBytes];
});
_c = ViewportSliceProgressScrollbar;
ViewportSliceProgressScrollbar.propTypes = {
  viewportData: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object),
  viewportId: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string).isRequired,
  element: prop_types__WEBPACK_IMPORTED_MODULE_1___default().instanceOf(Element),
  imageSliceData: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object).isRequired,
  setImageSliceData: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func).isRequired,
  servicesManager: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object).isRequired
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ViewportSliceProgressScrollbar);
var _c;
__webpack_require__.$Refresh$.register(_c, "ViewportSliceProgressScrollbar");

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportSliceProgressScrollbar/helpers.ts"
/*!*******************************************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/Overlays/ViewportSliceProgressScrollbar/helpers.ts ***!
  \*******************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getImageIdFromCacheEvent: () => (/* binding */ getImageIdFromCacheEvent),
/* harmony export */   getImageIndexFromEvent: () => (/* binding */ getImageIndexFromEvent),
/* harmony export */   getViewportImageIds: () => (/* binding */ getViewportImageIds),
/* harmony export */   isProgressFullMode: () => (/* binding */ isProgressFullMode)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cornerstonejs/core */ "../../../node_modules/@cornerstonejs/core/dist/esm/index.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");


function getImageIndexFromEvent(event) {
  const {
    imageIndex,
    newImageIdIndex = imageIndex,
    imageIdIndex
  } = event.detail;
  return newImageIdIndex ?? imageIdIndex;
}
function getViewportImageIds(viewportData) {
  if (!viewportData?.data?.length) {
    return [];
  }
  const firstData = viewportData.data[0];
  const volumeImageIds = firstData.volume?.imageIds;
  const datumImageIds = firstData.imageIds;
  return volumeImageIds || datumImageIds || [];
}
function isProgressFullMode(viewportData, viewport) {
  if (!viewportData || !viewport || viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.VolumeViewport3D) {
    return false;
  }
  if (viewportData.viewportType === _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.Enums.ViewportType.STACK) {
    return true;
  }
  if (viewportData.viewportType === _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.Enums.ViewportType.ORTHOGRAPHIC) {
    return !!viewport.isInAcquisitionPlane?.();
  }
  return false;
}
function getImageIdFromCacheEvent(event) {
  const detail = event?.detail;
  return detail?.imageId || detail?.image?.imageId || detail?.cachedImage?.imageId;
}

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportSliceProgressScrollbar/hooks.ts"
/*!*****************************************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/Overlays/ViewportSliceProgressScrollbar/hooks.ts ***!
  \*****************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useLoadedSliceBytes: () => (/* binding */ useLoadedSliceBytes),
/* harmony export */   useProgressScrollbarMode: () => (/* binding */ useProgressScrollbarMode),
/* harmony export */   useViewedSliceBytes: () => (/* binding */ useViewedSliceBytes),
/* harmony export */   useViewportSliceSync: () => (/* binding */ useViewportSliceSync)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @cornerstonejs/core */ "../../../node_modules/@cornerstonejs/core/dist/esm/index.js");
/* harmony import */ var _ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ohif/ui-next */ "../../ui-next/src/index.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers */ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportSliceProgressScrollbar/helpers.ts");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");

var _s = __webpack_require__.$Refresh$.signature(),
  _s2 = __webpack_require__.$Refresh$.signature(),
  _s3 = __webpack_require__.$Refresh$.signature(),
  _s4 = __webpack_require__.$Refresh$.signature();




function useProgressScrollbarMode({
  viewportData,
  viewportId,
  element,
  cornerstoneViewportService
}) {
  _s();
  const [isFullMode, setIsFullMode] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const lastViewPlaneNormalRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  /**
   * Tracks whether this viewport should render full progress UI (stack or acquisition-plane
   * orthographic volume) versus minimal UI. We compute once on setup and recompute on each
   * CAMERA_MODIFIED event so stack->MPR transitions and acquisition-plane changes are reflected
   * immediately.
   */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!viewportData) {
      return;
    }
    const updateMode = () => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      const viewportImageData = viewport?.getImageData?.();
      const nextViewPlaneNormal = viewport?.getCamera?.()?.viewPlaneNormal;
      // Do not update the lastViewPlaneNormalRef until we have a valid viewportImageData.
      // Without viewportImageData, the viewport is not fully initialized and the isAcquisitionPlane
      // check will not be accurate.
      if (viewportImageData && nextViewPlaneNormal) {
        lastViewPlaneNormalRef.current = [...nextViewPlaneNormal];
      }
      const nextMode = (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.isProgressFullMode)(viewportData, viewport);
      setIsFullMode(prevMode => prevMode === nextMode ? prevMode : nextMode);
    };
    updateMode();
    const onCameraModified = () => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      const nextViewPlaneNormal = viewport?.getCamera?.()?.viewPlaneNormal;
      const previousViewPlaneNormal = lastViewPlaneNormalRef.current;

      // Ignore camera updates that keep the same orientation (pan/zoom/scroll).
      if (nextViewPlaneNormal && previousViewPlaneNormal) {
        if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isEqual(nextViewPlaneNormal, previousViewPlaneNormal)) {
          return;
        }
      }
      updateMode();
    };
    element.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.Events.CAMERA_MODIFIED, onCameraModified);
    return () => {
      element.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.Events.CAMERA_MODIFIED, onCameraModified);
    };
  }, [viewportData, viewportId, cornerstoneViewportService, element]);
  return isFullMode;
}
_s(useProgressScrollbarMode, "XisvLMeuZvhjuhcmW6IEcnPJyGM=");
function useViewportSliceSync({
  viewportData,
  viewportId,
  element,
  cornerstoneViewportService,
  setImageSliceData
}) {
  _s2();
  /**
   * Keeps shared slice state in sync: first initialize from the live viewport snapshot, then
   * subscribe to navigation/render events for incremental updates while users scroll.
   */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!viewportData) {
      return;
    }
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (viewport && !(viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.VolumeViewport3D)) {
      try {
        const currentImageIndex = viewport.getCurrentImageIdIndex();
        const currentNumberOfSlices = viewport.getNumberOfSlices();
        setImageSliceData({
          imageIndex: currentImageIndex,
          numberOfSlices: currentNumberOfSlices
        });
      } catch (error) {
        console.warn(error);
      }
    }
    const {
      viewportType
    } = viewportData;
    const eventId = viewportType === _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.ViewportType.STACK && _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.Events.STACK_NEW_IMAGE || viewportType === _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.ViewportType.ORTHOGRAPHIC && _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.Events.VOLUME_NEW_IMAGE || _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.Events.IMAGE_RENDERED;
    const updateIndex = event => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport || viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.VolumeViewport3D) {
        return;
      }
      const nextImageIndex = (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.getImageIndexFromEvent)(event);
      if (nextImageIndex == null) {
        return;
      }
      const nextNumberOfSlices = viewport.getNumberOfSlices();
      setImageSliceData({
        imageIndex: nextImageIndex,
        numberOfSlices: nextNumberOfSlices
      });
    };
    element.addEventListener(eventId, updateIndex);
    return () => {
      element.removeEventListener(eventId, updateIndex);
    };
  }, [viewportData, element, viewportId, cornerstoneViewportService, setImageSliceData]);
}
_s2(useViewportSliceSync, "OD7bBpZva5O2jO+Puf00hKivP7c=");
function useLoadedSliceBytes({
  isFullMode,
  numberOfSlices,
  viewportData,
  imageIds,
  imageIdToIndex,
  loadedBatchIntervalMs
}) {
  _s3();
  const loadedState = (0,_ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__.useByteArray)(numberOfSlices || 0, loadedBatchIntervalMs);
  const {
    resetWith: resetLoaded,
    setByte: setLoadedByte,
    clearByte: clearLoadedByte
  } = loadedState;

  /**
   * Keeps the loaded byte array in sync with Cornerstone cache: seed from cache whenever stack /
   * mode / slice count changes, then subscribe so cache add/remove updates stay incremental.
   * Seeding runs immediately before registering listeners in the same effect.
   */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isFullMode && numberOfSlices) {
      resetLoaded(bytes => {
        for (let i = 0; i < bytes.length; i++) {
          const imageId = imageIds[i];
          if (imageId && _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.cache.isLoaded(imageId)) {
            bytes[i] = 1;
          }
        }
      });
    }
    if (!isFullMode || !viewportData) {
      return;
    }
    const markLoaded = event => {
      const imageId = (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.getImageIdFromCacheEvent)(event);
      if (!imageId) {
        return;
      }
      const index = imageIdToIndex.get(imageId);
      if (index !== undefined) {
        setLoadedByte(index);
      }
    };
    const markRemoved = event => {
      const imageId = (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.getImageIdFromCacheEvent)(event);
      if (!imageId) {
        return;
      }
      const index = imageIdToIndex.get(imageId);
      if (index !== undefined) {
        clearLoadedByte(index);
      }
    };
    _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.eventTarget.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.Events.IMAGE_CACHE_IMAGE_ADDED, markLoaded);
    _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.eventTarget.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.Events.IMAGE_CACHE_IMAGE_REMOVED, markRemoved);
    return () => {
      _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.eventTarget.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.Events.IMAGE_CACHE_IMAGE_ADDED, markLoaded);
      _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.eventTarget.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.Enums.Events.IMAGE_CACHE_IMAGE_REMOVED, markRemoved);
    };
  }, [imageIds, isFullMode, numberOfSlices, viewportData, imageIdToIndex, resetLoaded, setLoadedByte, clearLoadedByte]);
  return loadedState;
}
_s3(useLoadedSliceBytes, "jS25yjuqdeiMCD9Yq1QD96hY9kQ=", false, function () {
  return [_ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__.useByteArray];
});
function useViewedSliceBytes({
  isFullMode,
  numberOfSlices,
  imageIndex,
  imageIds,
  imageIdToIndex,
  viewedDwellMs,
  viewedDataService
}) {
  _s4();
  const viewedState = (0,_ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__.useByteArray)(numberOfSlices || 0);
  const {
    resetWith: resetViewed,
    setByte: setViewedByte
  } = viewedState;

  /**
   * Keeps the viewed byte array in sync with the global viewed-data store: seed from the store
   * whenever stack / mode / slice count changes, then subscribe so `markDataViewed` updates stay
   * incremental. Seeding runs immediately before registering the listener in the same effect.
   */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isFullMode && numberOfSlices) {
      resetViewed(bytes => {
        for (let i = 0; i < bytes.length; i++) {
          const imageId = imageIds[i];
          if (imageId && viewedDataService?.isDataViewed(imageId)) {
            bytes[i] = 1;
          }
        }
      });
    }
    if (!viewedDataService) {
      return;
    }
    const subscription = viewedDataService.subscribeViewedDataChanges(({
      viewedDataId,
      viewedDataCleared
    }) => {
      if (!isFullMode || !numberOfSlices) {
        return;
      }
      if (viewedDataCleared) {
        resetViewed(bytes => {
          bytes.fill(0);
        });
        return;
      }
      const index = imageIdToIndex.get(viewedDataId);
      if (index !== undefined) {
        setViewedByte(index);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [imageIds, isFullMode, numberOfSlices, imageIdToIndex, resetViewed, setViewedByte, viewedDataService]);

  /**
   * Marks slices as viewed in full mode. With `viewedDwellMs === 0`, marking is immediate on
   * index change; otherwise a dwell timer is used and cleaned up on subsequent changes/unmount.
   */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isFullMode || !numberOfSlices) {
      return;
    }
    const markViewed = targetIndex => {
      setViewedByte(targetIndex);
      const imageId = imageIds[targetIndex];
      if (imageId) {
        viewedDataService?.markDataViewed(imageId);
      }
    };
    if (viewedDwellMs === 0) {
      markViewed(imageIndex || 0);
      return;
    }
    const timerId = window.setTimeout(() => {
      markViewed(imageIndex || 0);
    }, viewedDwellMs);
    return () => {
      window.clearTimeout(timerId);
    };
  }, [isFullMode, numberOfSlices, imageIndex, imageIds, setViewedByte, viewedDwellMs, viewedDataService]);
  return viewedState;
}
_s4(useViewedSliceBytes, "ZP3sxzlY2c9jE83eUDOceWiqgGs=", false, function () {
  return [_ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__.useByteArray];
});

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/Viewport/Overlays/utils.ts"
/*!**********************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/Overlays/utils.ts ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatDICOMDate: () => (/* reexport safe */ _ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__.formatDICOMDate),
/* harmony export */   formatDICOMTime: () => (/* binding */ formatDICOMTime),
/* harmony export */   formatNumberPrecision: () => (/* binding */ formatNumberPrecision),
/* harmony export */   getCompression: () => (/* binding */ getCompression),
/* harmony export */   isValidNumber: () => (/* binding */ isValidNumber)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "../../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @cornerstonejs/core */ "../../../node_modules/@cornerstonejs/core/dist/esm/index.js");
/* harmony import */ var _ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ohif/ui-next */ "../../ui-next/src/index.ts");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");





/**
 * Checks if value is valid.
 *
 * @param {number} value
 * @returns {boolean} is valid.
 */
function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Formats number precision.
 *
 * @param {number} number
 * @param {number} precision
 * @returns {number} formatted number.
 */
function formatNumberPrecision(number, precision = 0) {
  if (number !== null) {
    return parseFloat(number).toFixed(precision);
  }
}

/**
 *    DICOM Time is stored as HHmmss.SSS, where:
 *      HH 24 hour time:
 *        m mm        0..59   Minutes
 *        s ss        0..59   Seconds
 *        S SS SSS    0..999  Fractional seconds
 *
 *        Goal: '24:12:12'
 *
 * @param {*} time
 * @param {string} strFormat
 * @returns {string} formatted name.
 */
function formatDICOMTime(time, strFormat = 'HH:mm:ss') {
  return moment__WEBPACK_IMPORTED_MODULE_0___default()(time, 'HH:mm:ss').format(strFormat);
}

/**
 * Gets compression type
 *
 * @param {number} imageId
 * @returns {string} compression type.
 */
function getCompression(imageId) {
  const generalImageModule = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.metaData.get('generalImageModule', imageId) || {};
  const {
    lossyImageCompression,
    lossyImageCompressionRatio,
    lossyImageCompressionMethod
  } = generalImageModule;
  if (lossyImageCompression === '01' && lossyImageCompressionRatio !== '') {
    const compressionMethod = lossyImageCompressionMethod || 'Lossy: ';
    const compressionRatio = formatNumberPrecision(lossyImageCompressionRatio, 2);
    return compressionMethod + compressionRatio + ' : 1';
  }
  return 'Lossless / Uncompressed';
}


const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/components/CinePlayer/CinePlayer.tsx"
/*!********************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/components/CinePlayer/CinePlayer.tsx ***!
  \********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ohif/ui-next */ "../../ui-next/src/index.ts");
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @cornerstonejs/core */ "../../../node_modules/@cornerstonejs/core/dist/esm/index.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @state */ "./state/index.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");

var _s = __webpack_require__.$Refresh$.signature(),
  _s2 = __webpack_require__.$Refresh$.signature();




function WrappedCinePlayer({
  enabledVPElement,
  viewportId,
  servicesManager
}) {
  _s();
  const {
    customizationService,
    displaySetService,
    viewportGridService
  } = servicesManager.services;
  const [{
    isCineEnabled,
    cines
  }, cineService] = (0,_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.useCine)();
  const [newStackFrameRate, setNewStackFrameRate] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(24);
  const [dynamicInfo, setDynamicInfo] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [appConfig] = (0,_state__WEBPACK_IMPORTED_MODULE_3__.useAppConfig)();
  const isMountedRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const cineHandler = () => {
    if (!cines?.[viewportId] || !enabledVPElement) {
      return;
    }
    const {
      isPlaying = false,
      frameRate = 24
    } = cines[viewportId];
    const validFrameRate = Math.max(frameRate, 1);
    return isPlaying ? cineService.playClip(enabledVPElement, {
      framesPerSecond: validFrameRate,
      viewportId
    }) : cineService.stopClip(enabledVPElement);
  };
  const newDisplaySetHandler = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!enabledVPElement || !isCineEnabled) {
      return;
    }
    const {
      viewports
    } = viewportGridService.getState();
    const {
      displaySetInstanceUIDs
    } = viewports.get(viewportId);
    let frameRate = 24;
    let isPlaying = cines[viewportId]?.isPlaying || false;
    displaySetInstanceUIDs.forEach(displaySetInstanceUID => {
      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
      if (displaySet.FrameRate) {
        // displaySet.FrameRate corresponds to DICOM tag (0018,1063) which is defined as the the frame time in milliseconds
        // So a bit of math to get the actual frame rate.
        frameRate = Math.round(1000 / displaySet.FrameRate);
        isPlaying ||= !!appConfig.autoPlayCine;
      }

      // check if the displaySet is dynamic and set the dynamic info
      if (displaySet.isDynamicVolume) {
        const {
          dynamicVolumeInfo
        } = displaySet;
        const numDimensionGroups = dynamicVolumeInfo.timePoints.length;
        const label = dynamicVolumeInfo.splittingTag;
        const dimensionGroupNumber = dynamicVolumeInfo.dimensionGroupNumber || 1;
        setDynamicInfo({
          volumeId: displaySet.displaySetInstanceUID,
          dimensionGroupNumber,
          numDimensionGroups,
          label
        });
      } else {
        setDynamicInfo(null);
      }
    });
    if (isPlaying) {
      cineService.setIsCineEnabled(isPlaying);
    }
    cineService.setCine({
      id: viewportId,
      isPlaying,
      frameRate
    });
    setNewStackFrameRate(frameRate);
  }, [displaySetService, viewportId, viewportGridService, cines, isCineEnabled, enabledVPElement]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    isMountedRef.current = true;
    newDisplaySetHandler();
    return () => {
      isMountedRef.current = false;
    };
  }, [isCineEnabled, newDisplaySetHandler]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isCineEnabled) {
      return;
    }
    cineHandler();
  }, [isCineEnabled, cineHandler, enabledVPElement]);

  /**
   * Use effect for handling new display set
   */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!enabledVPElement) {
      return;
    }
    enabledVPElement.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.VIEWPORT_NEW_IMAGE_SET, newDisplaySetHandler);
    // this doesn't makes sense that we are listening to this event on viewport element
    enabledVPElement.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.VOLUME_VIEWPORT_NEW_VOLUME, newDisplaySetHandler);
    return () => {
      cineService.setCine({
        id: viewportId,
        isPlaying: false
      });
      enabledVPElement.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.VIEWPORT_NEW_IMAGE_SET, newDisplaySetHandler);
      enabledVPElement.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.VOLUME_VIEWPORT_NEW_VOLUME, newDisplaySetHandler);
    };
  }, [enabledVPElement, newDisplaySetHandler, viewportId]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!cines || !cines[viewportId] || !enabledVPElement || !isMountedRef.current) {
      return;
    }
    cineHandler();
    return () => {
      cineService.stopClip(enabledVPElement, {
        viewportId
      });
    };
  }, [cines, viewportId, cineService, enabledVPElement, cineHandler]);
  if (!isCineEnabled) {
    return null;
  }
  const cine = cines[viewportId];
  const isPlaying = cine?.isPlaying || false;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(RenderCinePlayer, {
    viewportId: viewportId,
    cineService: cineService,
    newStackFrameRate: newStackFrameRate,
    isPlaying: isPlaying,
    dynamicInfo: dynamicInfo,
    customizationService: customizationService
  });
}
_s(WrappedCinePlayer, "KDnWruUt0OxNbkaov1IuXj9K31k=", false, function () {
  return [_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.useCine, _state__WEBPACK_IMPORTED_MODULE_3__.useAppConfig];
});
_c = WrappedCinePlayer;
function RenderCinePlayer({
  viewportId,
  cineService,
  newStackFrameRate,
  isPlaying,
  dynamicInfo: dynamicInfoProp,
  customizationService
}) {
  _s2();
  const CinePlayerComponent = customizationService.getCustomization('cinePlayer');
  const [dynamicInfo, setDynamicInfo] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(dynamicInfoProp);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setDynamicInfo(dynamicInfoProp);
  }, [dynamicInfoProp]);

  /**
   * Use effect for handling 4D time index changed
   */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!dynamicInfo) {
      return;
    }
    const handleDimensionGroupChange = evt => {
      const {
        volumeId,
        dimensionGroupNumber,
        numDimensionGroups,
        splittingTag
      } = evt.detail;
      setDynamicInfo({
        volumeId,
        dimensionGroupNumber,
        numDimensionGroups,
        label: splittingTag
      });
    };
    _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.eventTarget.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.DYNAMIC_VOLUME_DIMENSION_GROUP_CHANGED, handleDimensionGroupChange);
    return () => {
      _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.eventTarget.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.Enums.Events.DYNAMIC_VOLUME_DIMENSION_GROUP_CHANGED, handleDimensionGroupChange);
    };
  }, [dynamicInfo]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!dynamicInfo) {
      return;
    }
    const {
      volumeId,
      dimensionGroupNumber,
      numDimensionGroups,
      splittingTag
    } = dynamicInfo || {};
    const volume = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.cache.getVolume(volumeId, true);
    volume.dimensionGroupNumber = dimensionGroupNumber;
    setDynamicInfo({
      volumeId,
      dimensionGroupNumber,
      numDimensionGroups,
      label: splittingTag
    });
  }, []);
  const updateDynamicInfo = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(props => {
    const {
      volumeId,
      dimensionGroupNumber
    } = props;
    const volume = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_2__.cache.getVolume(volumeId, true);
    volume.dimensionGroupNumber = dimensionGroupNumber;
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CinePlayerComponent, {
    className: "absolute left-1/2 bottom-3 -translate-x-1/2",
    frameRate: newStackFrameRate,
    isPlaying: isPlaying,
    onClose: () => {
      // also stop the clip
      cineService.setCine({
        id: viewportId,
        isPlaying: false
      });
      cineService.setIsCineEnabled(false);
      cineService.setViewportCineClosed(viewportId);
    },
    onPlayPauseChange: isPlaying => {
      cineService.setCine({
        id: viewportId,
        isPlaying
      });
    },
    onFrameRateChange: frameRate => cineService.setCine({
      id: viewportId,
      frameRate
    }),
    dynamicInfo: dynamicInfo,
    updateDynamicInfo: updateDynamicInfo
  });
}
_s2(RenderCinePlayer, "JKVqxBuKJePknzpHlw0z+0z0gWQ=");
_c2 = RenderCinePlayer;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WrappedCinePlayer);
var _c, _c2;
__webpack_require__.$Refresh$.register(_c, "WrappedCinePlayer");
__webpack_require__.$Refresh$.register(_c2, "RenderCinePlayer");

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/components/CinePlayer/index.ts"
/*!**************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/components/CinePlayer/index.ts ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CinePlayer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CinePlayer */ "../../../extensions/cornerstone/src/components/CinePlayer/CinePlayer.tsx");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_CinePlayer__WEBPACK_IMPORTED_MODULE_0__["default"]);

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/components/OHIFViewportActionCorners.tsx"
/*!************************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/components/OHIFViewportActionCorners.tsx ***!
  \************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ohif/ui-next */ "../../ui-next/src/index.ts");
/* harmony import */ var _ohif_extension_default_src_Toolbar_Toolbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ohif/extension-default/src/Toolbar/Toolbar */ "../../../extensions/default/src/Toolbar/Toolbar.tsx");
/* harmony import */ var _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ohif/core/src/services/ToolBarService/ToolbarService */ "../../core/src/services/ToolBarService/ToolbarService.ts");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hooks */ "../../../extensions/cornerstone/src/hooks/index.ts");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");

var _s = __webpack_require__.$Refresh$.signature();





function OHIFViewportActionCornersComponent({
  viewportId
}) {
  _s();
  // Use the viewport hover hook to track if viewport is hovered or active
  const {
    isHovered,
    isActive
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_4__.useViewportHover)(viewportId);
  const shouldShowCorners = isHovered || isActive;
  if (!shouldShowCorners) {
    return null;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.IconPresentationProvider, {
    size: "medium",
    IconContainer: _ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.ToolButton,
    containerProps: {
      size: 'tiny',
      className: 'font-normal text-primary hover:bg-primary/25'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.ViewportActionCorners.Container, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.ViewportActionCorners.TopLeft, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_extension_default_src_Toolbar_Toolbar__WEBPACK_IMPORTED_MODULE_2__.Toolbar, {
    buttonSection: "viewportActionMenu.topLeft",
    viewportId: viewportId,
    location: _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_3__.ButtonLocation.TopLeft
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.ViewportActionCorners.TopMiddle, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_extension_default_src_Toolbar_Toolbar__WEBPACK_IMPORTED_MODULE_2__.Toolbar, {
    buttonSection: "viewportActionMenu.topMiddle",
    viewportId: viewportId,
    location: _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_3__.ButtonLocation.TopMiddle
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.ViewportActionCorners.TopRight, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_extension_default_src_Toolbar_Toolbar__WEBPACK_IMPORTED_MODULE_2__.Toolbar, {
    buttonSection: "viewportActionMenu.topRight",
    viewportId: viewportId,
    location: _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_3__.ButtonLocation.TopRight
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.ViewportActionCorners.LeftMiddle, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_extension_default_src_Toolbar_Toolbar__WEBPACK_IMPORTED_MODULE_2__.Toolbar, {
    buttonSection: "viewportActionMenu.leftMiddle",
    viewportId: viewportId,
    location: _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_3__.ButtonLocation.LeftMiddle
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.ViewportActionCorners.RightMiddle, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_extension_default_src_Toolbar_Toolbar__WEBPACK_IMPORTED_MODULE_2__.Toolbar, {
    buttonSection: "viewportActionMenu.rightMiddle",
    viewportId: viewportId,
    location: _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_3__.ButtonLocation.RightMiddle
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.ViewportActionCorners.BottomLeft, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_extension_default_src_Toolbar_Toolbar__WEBPACK_IMPORTED_MODULE_2__.Toolbar, {
    buttonSection: "viewportActionMenu.bottomLeft",
    viewportId: viewportId,
    location: _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_3__.ButtonLocation.BottomLeft
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.ViewportActionCorners.BottomMiddle, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_extension_default_src_Toolbar_Toolbar__WEBPACK_IMPORTED_MODULE_2__.Toolbar, {
    buttonSection: "viewportActionMenu.bottomMiddle",
    viewportId: viewportId,
    location: _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_3__.ButtonLocation.BottomMiddle
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__.ViewportActionCorners.BottomRight, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ohif_extension_default_src_Toolbar_Toolbar__WEBPACK_IMPORTED_MODULE_2__.Toolbar, {
    buttonSection: "viewportActionMenu.bottomRight",
    viewportId: viewportId,
    location: _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_3__.ButtonLocation.BottomRight
  }))));
}
_s(OHIFViewportActionCornersComponent, "eKWYW/pSr/1zijALe7WQmHOnuRU=", false, function () {
  return [_hooks__WEBPACK_IMPORTED_MODULE_4__.useViewportHover];
});
_c = OHIFViewportActionCornersComponent;
const OHIFViewportActionCorners = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(OHIFViewportActionCornersComponent);
_c2 = OHIFViewportActionCorners;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OHIFViewportActionCorners);
var _c, _c2;
__webpack_require__.$Refresh$.register(_c, "OHIFViewportActionCornersComponent");
__webpack_require__.$Refresh$.register(_c2, "OHIFViewportActionCorners");

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/utils/ActiveViewportBehavior.tsx"
/*!****************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/utils/ActiveViewportBehavior.tsx ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");

var _s = __webpack_require__.$Refresh$.signature();

const ActiveViewportBehavior = /*#__PURE__*/_s(/*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(_c = _s(({
  servicesManager,
  viewportId
}) => {
  _s();
  const {
    displaySetService,
    cineService,
    viewportGridService,
    customizationService,
    cornerstoneViewportService
  } = servicesManager.services;
  const [activeViewportId, setActiveViewportId] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(viewportId);
  const handleCineEnable = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (cineService.isViewportCineClosed(activeViewportId)) {
      return;
    }
    const displaySetInstanceUIDs = viewportGridService.getDisplaySetsUIDsForViewport(activeViewportId);
    if (!displaySetInstanceUIDs) {
      return;
    }
    const displaySets = displaySetInstanceUIDs.map(uid => displaySetService.getDisplaySetByUID(uid));
    if (!displaySets.length) {
      return;
    }
    const modalities = displaySets.map(displaySet => displaySet?.Modality);
    const isDynamicVolume = displaySets.some(displaySet => displaySet?.isDynamicVolume);
    const sourceModalities = customizationService.getCustomization('autoCineModalities');
    const requiresCine = modalities.some(modality => sourceModalities.includes(modality));
    if ((requiresCine || isDynamicVolume) && !cineService.getState().isCineEnabled) {
      cineService.setIsCineEnabled(true);
    }
  }, [activeViewportId, cineService, viewportGridService, displaySetService, customizationService]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const subscription = viewportGridService.subscribe(viewportGridService.EVENTS.ACTIVE_VIEWPORT_ID_CHANGED, ({
      viewportId
    }) => setActiveViewportId(viewportId));
    return () => subscription.unsubscribe();
  }, [viewportId, viewportGridService]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const subscription = cornerstoneViewportService.subscribe(cornerstoneViewportService.EVENTS.VIEWPORT_DATA_CHANGED, () => {
      const activeViewportId = viewportGridService.getActiveViewportId();
      setActiveViewportId(activeViewportId);
      handleCineEnable();
    });
    return () => subscription.unsubscribe();
  }, [viewportId, cornerstoneViewportService, viewportGridService, handleCineEnable]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    handleCineEnable();
  }, [handleCineEnable]);
  return null;
}, "BpCofdEZ7S5rfxI0xcVkVPdo4S4="), arePropsEqual), "BpCofdEZ7S5rfxI0xcVkVPdo4S4=");
_c2 = ActiveViewportBehavior;
ActiveViewportBehavior.displayName = 'ActiveViewportBehavior';
function arePropsEqual(prevProps, nextProps) {
  return prevProps.viewportId === nextProps.viewportId && prevProps.servicesManager === nextProps.servicesManager;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ActiveViewportBehavior);
var _c, _c2;
__webpack_require__.$Refresh$.register(_c, "ActiveViewportBehavior$memo");
__webpack_require__.$Refresh$.register(_c2, "ActiveViewportBehavior");

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../extensions/cornerstone/src/utils/presentations/getViewportPresentations.ts"
/*!*******************************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/utils/presentations/getViewportPresentations.ts ***!
  \*******************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getViewportPresentations: () => (/* binding */ getViewportPresentations)
/* harmony export */ });
/* harmony import */ var _stores_usePositionPresentationStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../stores/usePositionPresentationStore */ "../../../extensions/cornerstone/src/stores/usePositionPresentationStore.ts");
/* harmony import */ var _stores_useLutPresentationStore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../stores/useLutPresentationStore */ "../../../extensions/cornerstone/src/stores/useLutPresentationStore.ts");
/* harmony import */ var _stores_useSegmentationPresentationStore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../stores/useSegmentationPresentationStore */ "../../../extensions/cornerstone/src/stores/useSegmentationPresentationStore.ts");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../../node_modules/react-refresh/runtime.js */ "../../../node_modules/react-refresh/runtime.js");




function getViewportPresentations(viewportId, viewportOptions) {
  const {
    lutPresentationStore
  } = _stores_useLutPresentationStore__WEBPACK_IMPORTED_MODULE_1__.useLutPresentationStore.getState();
  const {
    positionPresentationStore
  } = _stores_usePositionPresentationStore__WEBPACK_IMPORTED_MODULE_0__.usePositionPresentationStore.getState();
  const {
    segmentationPresentationStore
  } = _stores_useSegmentationPresentationStore__WEBPACK_IMPORTED_MODULE_2__.useSegmentationPresentationStore.getState();

  // NOTE: this is the new viewport state, we should not get the presentationIds from the cornerstoneViewportService
  // since that has the old viewport state
  const {
    presentationIds
  } = viewportOptions;
  if (!presentationIds) {
    return {
      positionPresentation: null,
      lutPresentation: null,
      segmentationPresentation: null
    };
  }
  const {
    lutPresentationId,
    positionPresentationId,
    segmentationPresentationId
  } = presentationIds;
  const positionPresentation = positionPresentationStore[positionPresentationId];
  const lutPresentation = lutPresentationStore[lutPresentationId];
  const segmentationPresentation = segmentationPresentationStore[segmentationPresentationId];
  return {
    positionPresentation,
    lutPresentation,
    segmentationPresentation
  };
}

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (false) // removed by dead control flow
{}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ },

/***/ "../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].use[2]!../../../extensions/cornerstone/src/Viewport/OHIFCornerstoneViewport.css"
/*!**************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].use[2]!../../../extensions/cornerstone/src/Viewport/OHIFCornerstoneViewport.css ***!
  \**************************************************************************************************************************************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "../../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.viewport-wrapper {
  width: 100%;
  height: 100%; /* MUST have \`height\` to prevent resize infinite loop */
  position: relative;
  /* Prevent text selection on the entire viewport wrapper */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.cornerstone-viewport-element {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: black;

  /* Prevent the blue outline in Chrome when a viewport is selected */
  outline: 0 !important;

  /* Prevents the entire page from getting larger
     when the magnify tool is near the sides/corners of the page */
  overflow: hidden;
  
  /* Prevent text selection on the viewport element */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Prevent text selection on overlay elements */

.noselect {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Ensure all elements within viewport wrapper prevent text selection */

.viewport-wrapper * {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
`, "",{"version":3,"sources":["webpack://./../../../extensions/cornerstone/src/Viewport/OHIFCornerstoneViewport.css"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY,EAAE,uDAAuD;EACrE,kBAAkB;EAClB,0DAA0D;EAC1D,iBAAiB;EACjB,yBAAyB;EACzB,sBAAsB;EACtB,qBAAqB;AACvB;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,uBAAuB;;EAEvB,mEAAmE;EACnE,qBAAqB;;EAErB;kEACgE;EAChE,gBAAgB;;EAEhB,mDAAmD;EACnD,iBAAiB;EACjB,yBAAyB;EACzB,sBAAsB;EACtB,qBAAqB;AACvB;;AAEA,+CAA+C;;AAC/C;EACE,iBAAiB;EACjB,yBAAyB;EACzB,sBAAsB;EACtB,qBAAqB;AACvB;;AAEA,uEAAuE;;AACvE;EACE,iBAAiB;EACjB,yBAAyB;EACzB,sBAAsB;EACtB,qBAAqB;AACvB","sourcesContent":[".viewport-wrapper {\n  width: 100%;\n  height: 100%; /* MUST have `height` to prevent resize infinite loop */\n  position: relative;\n  /* Prevent text selection on the entire viewport wrapper */\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n\n.cornerstone-viewport-element {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  background-color: black;\n\n  /* Prevent the blue outline in Chrome when a viewport is selected */\n  outline: 0 !important;\n\n  /* Prevents the entire page from getting larger\n     when the magnify tool is near the sides/corners of the page */\n  overflow: hidden;\n  \n  /* Prevent text selection on the viewport element */\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n\n/* Prevent text selection on overlay elements */\n.noselect {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n\n/* Ensure all elements within viewport wrapper prevent text selection */\n.viewport-wrapper * {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].use[2]!../../../extensions/cornerstone/src/Viewport/Overlays/CustomizableViewportOverlay.css"
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].use[2]!../../../extensions/cornerstone/src/Viewport/Overlays/CustomizableViewportOverlay.css ***!
  \***************************************************************************************************************************************************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*
custom overlay panels: top-left, top-right, bottom-left and bottom-right
If any text to be displayed on the overlay is too long to hold on a single
line, it will be truncated with ellipsis in the end.
*/
.viewport-overlay {
  max-width: 40%;
}
.viewport-overlay span {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.viewport-overlay.left-viewport {
  text-align: left;
}
.viewport-overlay.right-viewport-scrollbar {
  text-align: right;
}
.viewport-overlay.right-viewport-scrollbar .flex.flex-row {
  -webkit-box-pack: end;
      -ms-flex-pack: end;
          justify-content: flex-end;
}
`, "",{"version":3,"sources":["webpack://./../../../extensions/cornerstone/src/Viewport/Overlays/CustomizableViewportOverlay.css"],"names":[],"mappings":"AAAA;;;;CAIC;AACD;EACE,cAAc;AAChB;AACA;EACE,eAAe;EACf,gBAAgB;EAChB,uBAAuB;EACvB,mBAAmB;AACrB;AAEA;EACE,gBAAgB;AAClB;AAEA;EACE,iBAAiB;AACnB;AACA;EACE,qBAAyB;MAAzB,kBAAyB;UAAzB,yBAAyB;AAC3B","sourcesContent":["/*\ncustom overlay panels: top-left, top-right, bottom-left and bottom-right\nIf any text to be displayed on the overlay is too long to hold on a single\nline, it will be truncated with ellipsis in the end.\n*/\n.viewport-overlay {\n  max-width: 40%;\n}\n.viewport-overlay span {\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.viewport-overlay.left-viewport {\n  text-align: left;\n}\n\n.viewport-overlay.right-viewport-scrollbar {\n  text-align: right;\n}\n.viewport-overlay.right-viewport-scrollbar .flex.flex-row {\n  justify-content: flex-end;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].use[2]!../../../extensions/cornerstone/src/Viewport/Overlays/ViewportOrientationMarkers.css"
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].use[2]!../../../extensions/cornerstone/src/Viewport/Overlays/ViewportOrientationMarkers.css ***!
  \**************************************************************************************************************************************************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.ViewportOrientationMarkers {
  --marker-width: 100px;
  --marker-height: 100px;
  --scrollbar-width: 20px;
  pointer-events: none;
  line-height: 18px;
}
.ViewportOrientationMarkers .orientation-marker {
  position: absolute;
}
.ViewportOrientationMarkers .top-mid {
  top: 0.38rem;
  left: 50%;
  -webkit-transform: translateX(-50%);
          transform: translateX(-50%);
}
.ViewportOrientationMarkers .left-mid {
  top: 50%;
  left: 0.38rem;
  -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
}
.ViewportOrientationMarkers .right-mid {
  top: 50%;
  left: calc(100% - var(--marker-width) - var(--scrollbar-width));
  -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
}
.ViewportOrientationMarkers .bottom-mid {
  top: calc(100% - var(--marker-height) - 0.6rem);
  left: 50%;
  -webkit-transform: translateX(-50%);
          transform: translateX(-50%);
}
.ViewportOrientationMarkers .right-mid .orientation-marker-value {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
      -ms-flex-pack: end;
          justify-content: flex-end;
  min-width: var(--marker-width);
}
.ViewportOrientationMarkers .bottom-mid .orientation-marker-value {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
      -ms-flex-pack: start;
          justify-content: flex-start;
  min-height: var(--marker-height);
  -webkit-box-orient: vertical;
  -webkit-box-direction: reverse;
      -ms-flex-direction: column-reverse;
          flex-direction: column-reverse;
}
`, "",{"version":3,"sources":["webpack://./../../../extensions/cornerstone/src/Viewport/Overlays/ViewportOrientationMarkers.css"],"names":[],"mappings":"AAAA;EACE,qBAAqB;EACrB,sBAAsB;EACtB,uBAAuB;EACvB,oBAAoB;EACpB,iBAAiB;AACnB;AACA;EACE,kBAAkB;AACpB;AACA;EACE,YAAY;EACZ,SAAS;EACT,mCAA2B;UAA3B,2BAA2B;AAC7B;AACA;EACE,QAAQ;EACR,aAAa;EACb,mCAA2B;UAA3B,2BAA2B;AAC7B;AACA;EACE,QAAQ;EACR,+DAA+D;EAC/D,mCAA2B;UAA3B,2BAA2B;AAC7B;AACA;EACE,+CAA+C;EAC/C,SAAS;EACT,mCAA2B;UAA3B,2BAA2B;AAC7B;AACA;EACE,oBAAa;EAAb,oBAAa;EAAb,aAAa;EACb,qBAAyB;MAAzB,kBAAyB;UAAzB,yBAAyB;EACzB,8BAA8B;AAChC;AACA;EACE,oBAAa;EAAb,oBAAa;EAAb,aAAa;EACb,uBAA2B;MAA3B,oBAA2B;UAA3B,2BAA2B;EAC3B,gCAAgC;EAChC,4BAA8B;EAA9B,8BAA8B;MAA9B,kCAA8B;UAA9B,8BAA8B;AAChC","sourcesContent":[".ViewportOrientationMarkers {\n  --marker-width: 100px;\n  --marker-height: 100px;\n  --scrollbar-width: 20px;\n  pointer-events: none;\n  line-height: 18px;\n}\n.ViewportOrientationMarkers .orientation-marker {\n  position: absolute;\n}\n.ViewportOrientationMarkers .top-mid {\n  top: 0.38rem;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.ViewportOrientationMarkers .left-mid {\n  top: 50%;\n  left: 0.38rem;\n  transform: translateY(-50%);\n}\n.ViewportOrientationMarkers .right-mid {\n  top: 50%;\n  left: calc(100% - var(--marker-width) - var(--scrollbar-width));\n  transform: translateY(-50%);\n}\n.ViewportOrientationMarkers .bottom-mid {\n  top: calc(100% - var(--marker-height) - 0.6rem);\n  left: 50%;\n  transform: translateX(-50%);\n}\n.ViewportOrientationMarkers .right-mid .orientation-marker-value {\n  display: flex;\n  justify-content: flex-end;\n  min-width: var(--marker-width);\n}\n.ViewportOrientationMarkers .bottom-mid .orientation-marker-value {\n  display: flex;\n  justify-content: flex-start;\n  min-height: var(--marker-height);\n  flex-direction: column-reverse;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../../../extensions/cornerstone/src/Viewport/OHIFCornerstoneViewport.css"
/*!********************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/OHIFCornerstoneViewport.css ***!
  \********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var api = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].use[1]!../../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].use[2]!./OHIFCornerstoneViewport.css */ "../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].use[2]!../../../extensions/cornerstone/src/Viewport/OHIFCornerstoneViewport.css");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.id, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ },

/***/ "../../../extensions/cornerstone/src/Viewport/Overlays/CustomizableViewportOverlay.css"
/*!*********************************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/Overlays/CustomizableViewportOverlay.css ***!
  \*********************************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var api = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].use[1]!../../../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].use[2]!./CustomizableViewportOverlay.css */ "../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].use[2]!../../../extensions/cornerstone/src/Viewport/Overlays/CustomizableViewportOverlay.css");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.id, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ },

/***/ "../../../extensions/cornerstone/src/Viewport/Overlays/ViewportOrientationMarkers.css"
/*!********************************************************************************************!*\
  !*** ../../../extensions/cornerstone/src/Viewport/Overlays/ViewportOrientationMarkers.css ***!
  \********************************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var api = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].use[1]!../../../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].use[2]!./ViewportOrientationMarkers.css */ "../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[5].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[5].use[2]!../../../extensions/cornerstone/src/Viewport/Overlays/ViewportOrientationMarkers.css");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.id, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }

}]);
//# sourceMappingURL=extensions_cornerstone_src_Viewport_OHIFCornerstoneViewport_tsx.js.map