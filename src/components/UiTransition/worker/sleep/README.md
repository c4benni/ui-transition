# worker/sleep ($sleep)

Creates an `async` timeout that is called, and cleared in the same worker thread that handles creating spring animations. This is to have a way of calling making sure the worker has responded before carrying out some other logic.
