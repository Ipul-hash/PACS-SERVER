window.config = { 
routerBasename: '/', 
showStudyList: true,
extensions: [],
modes: [],
defaultDataSourceName: 'dicomweb', 
dataSources: [
{
namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
sourceName: 'dicomweb', 
configuration: {
friendlyName: 'Orthanc Local PACS', 
name: 'Orthanc',

wadoUriRoot: '/orthanc/dicom-web', 
qidoRoot: '/orthanc/dicom-web', 
wadoRoot: '/orthanc/dicom-web',

qidoSupportsIncludeField: true, 
imageRendering: 'wadors', 
thumbnailRendering: 'wadors', 
enableStudyLazyLoad: true, 
supportsFuzzyMatching: true, 
supportsWildcard: true, 
dicomUploadEnabled: true, 
omitQuotationForMultipartRequest: true,
},
},
{
namespace: 
'@ohif/extension-default.dataSourcesModule.dicomjson',
sourceName: 'dicomjson', 
configuration: { 
friendlyName: 'dicom json', 
name: 'json',
},
},
{
namespace: 
'@ohif/extension-default.dataSourcesModule.dicomlocal',
sourceName: 'dicomlocal', 
configuration: { 
friendlyName: 'dicom local',
},
},
],
};
