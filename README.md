### ReactJS with nodeJS integration for User Sign up, login and password update
```https://reactjs-boiler.web.app```

## Useful shared components
### Hooks
```

- auth-hook.js
Stores jwt token in localstorage under "userdata" on login
Removes jwt token upon logout
Sets token expiration date(default 1 hr)

- form-hook.js, Input.js
Manages formState, inputHandler
Able to setFormState in the event of additional input requirements
i.e 
setFormData(
  {
    ...formState.inputs,
    additionalFields: { value:"", isValid:false}
  }
)

- http-hook.js
Replaces fetch function and returns params that are useful for rendering
```
### UI elements
```
ErrorModal - when there is an error is returned
Loading Spinner - for loading purposes
```

### Navigation
```
Copy pasta for quick setup
```
