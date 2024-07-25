Run the application using,
```
mvn spring-boot:run
```
Make sure you don't have a custom repository configured in `.m2/settings.xml` for the dependencies to be correctly downloaded.


### API Specification

Note that all verbs are not supported yet, this is a work in progress, verbs in parenthesis are not implemented. 

| Endpoint          |                 Supported Verbs |      Filtering |
|-------------------|---------------------------------|----------------|
| /refs             | GET, POST                       | NA             |
| /refs/:id         | GET, PUT, DELETE                | NA             |
| /cols             | GET, POST                       | yes, via refid |
| /cols/:id         | GET, (PUT), (DELETE)            | NA             |
| /entries          | GET, POST                       | yes, via refid |
| /entries/:id      | GET, PUT, DELETE                | NA             |
| /views            | GET, POST                       | yes, via refid |
| /views/:id        | GET, (PUT)                      | NA             |


### Error Handling

At the moment, there is no unified error handling specification that endpoints should return. The idea was to wait for the transfer to the team, this is starting to create massive technical debt, we therefore define a new error specification here, 


#### Business/Validation Error Handling

The general returned error (be it business or validation errors) format will be something like,
```
{
    'field1': 'error message for field1',
    'field2': 'error message for field2',
    ...
}
```

This will support errors like, in the case of a POST or PUT of a referential with a blank code and a name that already exists,


```
{
    'name': 'Another ref with that name already exists',
    'code': 'Code cannot be blank'
}
```

Updating existing column with invalid date syntax and column has duplicate values so cannot be a BK, 
```
{
    'DateFormat': 'Invalid DateFormat syntax, see specification at https://...',
    'ColType': 'Error setting column type to BK, column contains duplicate entries'
}
```

The API should handle business and simple validation errors the same way. The returned errors should always follow the same format. 

When creating an entry which would lead to BK duplication we'd get, 
```
{
    'colIdWithBK': 'BK value already exists in entries'
}
```

Then, in the frontend side, the idea is to check for the precense of an error map or not, and display the error in the concerned field using something like, 

```
<mat-form-field subscriptSizing="dynamic" style="width: 100%;">
    <mat-label>Code</mat-label>
    <input matInput formControlName="code">
    <ng-container *ngIf="ErrorMap['code']">
        <mat-error>{{ErrorMap['code']}}</mat-error>
    </ng-container>
</mat-form-field>
```

E.g, when posting/putting the referential if the errorMap gets a value, then an error happened, hence, we display it in the appropriate fields. We do a similar recipe when diplaying errors in
key value entries displays, and really in any text box across Refero. 

#### Not Found / Unauthorized Errors

In this case, we do not follow the convention above, we simply return generic NOT FOUND or UNAUTHORIZED errors. 