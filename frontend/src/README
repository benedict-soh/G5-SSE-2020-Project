#How login keeps track of login status

So react uses a global store to keep track of its internal states. You can see all implementation details about the store here:
https://github.com/benedict-soh/G5-SSE-2020-Project/blob/master/frontend/src/utils/store.js

The authentication token is stored automagically at the browser as an HTTPonly cookie (also designed to be secure too, hopefully) when the user logs in. 
So we can't actually track the login status with the cookie itself. All we can do at the frontend is set a variable to true so that our UI can change accordingly. But React also 
doesn't keep track of global states on its own, so the solution is to use a Redux store. This is because we want to be able to check if the user is logged in anywhere we want in the code. 

The problem is, this store is set to its initial state like this everytime the page is refreshed:
```
export const initialState = {
    isLoggedIn: false,
};
```
This means that everytime the user refreshes the page, the UI will show that they're logged out.

Oh no!

But we can fix this by making the <App> make an API call on mount, which means that we can correctly set isLoggedIn with every page refresh.
This can also be done on authorised pages, where there should be an API call to check if we should even display the page to the user. 

Note that we might want to propagate this check down the tree in the future so the client doesn't make 5 API calls to test its authorisation everytime the page is refreshed.


Here's a good page on how to access a react redux store (we're using a single store): https://react-redux.js.org/using-react-redux/accessing-store

This provides some basic background info about Redux stores: https://redux.js.org/api/store
