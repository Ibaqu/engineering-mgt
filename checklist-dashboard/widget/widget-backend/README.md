# checklist-widget-backend

This is to generate an intermediate service which will act as the backend of the Checklist widget. 

The widget will call the endpoints mentioned in this service and the service is responsible for invoking appropriate endpoints from the Ballerina service.

Add the Ballerina service url to <SP_HOME>/conf/dashboard/deployment.yaml following the sample in engineering-mgt/database/datasource-samples/**backend-services.yaml**

```
# RRM dashboards backend URLs
rrm.checklist.configs:
  checklistBackendUrl: 'http://localhost:9090'
```

To build the widget-backend intermediate service run below command from 
engineering-mgt/checklist-dashboard/widget/**widget-backend**
```
mvn clean install
```
Place the resulted target/checklist-backend-service.jar in <SP_HOME>/libs

Please update the POM dependencies if the jar doesnt deploy properly.
