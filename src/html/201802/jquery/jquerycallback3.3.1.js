var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
    var object = {};
    jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
        object[ flag ] = true;
    } );
    return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

    // Convert options from String-formatted to Object-formatted if needed
    // (we check in cache first)
    options = typeof options === "string" ?
        createOptions( options ) :
        jQuery.extend( {}, options );

    var // Flag to know if list is currently firing
        firing,

        // Last fire value for non-forgettable lists
        memory,

        // Flag to know if list was already fired
        fired,

        // Flag to prevent firing
        locked,

        // Actual callback list
        list = [],

        // Queue of execution data for repeatable lists
        queue = [],

        // Index of currently firing callback (modified by add/remove as needed)
        firingIndex = -1,

        // Fire callbacks
        fire = function() {

            // Enforce single-firing
            locked = locked || options.once;

            // Execute callbacks for all pending executions,
            // respecting firingIndex overrides and runtime changes
            fired = firing = true;
            for ( ; queue.length; firingIndex = -1 ) {
                memory = queue.shift();
                while ( ++firingIndex < list.length ) {

                    // Run callback and check for early termination
                    if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
                        options.stopOnFalse ) {

                        // Jump to end and forget the data so .add doesn't re-fire
                        firingIndex = list.length;
                        memory = false;
                    }
                }
            }

            // Forget the data if we're done with it
            if ( !options.memory ) {
                memory = false;
            }

            firing = false;

            // Clean up if we're done firing for good
            if ( locked ) {

                // Keep an empty list if we have data for future add calls
                if ( memory ) {
                    list = [];

                    // Otherwise, this object is spent
                } else {
                    list = "";
                }
            }
        },

        // Actual Callbacks object
        self = {

            // Add a callback or a collection of callbacks to the list
            add: function() {
                if ( list ) {

                    // If we have memory from a past run, we should fire after adding
                    if ( memory && !firing ) {
                        firingIndex = list.length - 1;
                        queue.push( memory );
                    }

                    ( function add( args ) {
                        jQuery.each( args, function( _, arg ) {
                            if ( isFunction( arg ) ) {
                                if ( !options.unique || !self.has( arg ) ) {
                                    list.push( arg );
                                }
                            } else if ( arg && arg.length && toType( arg ) !== "string" ) {

                                // Inspect recursively
                                add( arg );
                            }
                        } );
                    } )( arguments );

                    if ( memory && !firing ) {
                        fire();
                    }
                }
                return this;
            },

            // Remove a callback from the list
            remove: function() {
                jQuery.each( arguments, function( _, arg ) {
                    var index;
                    while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
                        list.splice( index, 1 );

                        // Handle firing indexes
                        if ( index <= firingIndex ) {
                            firingIndex--;
                        }
                    }
                } );
                return this;
            },

            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function( fn ) {
                return fn ?
                    jQuery.inArray( fn, list ) > -1 :
                    list.length > 0;
            },

            // Remove all callbacks from the list
            empty: function() {
                if ( list ) {
                    list = [];
                }
                return this;
            },

            // Disable .fire and .add
            // Abort any current/pending executions
            // Clear all callbacks and values
            disable: function() {
                locked = queue = [];
                list = memory = "";
                return this;
            },
            disabled: function() {
                return !list;
            },

            // Disable .fire
            // Also disable .add unless we have memory (since it would have no effect)
            // Abort any pending executions
            lock: function() {
                locked = queue = [];
                if ( !memory && !firing ) {
                    list = memory = "";
                }
                return this;
            },
            locked: function() {
                return !!locked;
            },

            // Call all callbacks with the given context and arguments
            fireWith: function( context, args ) {
                if ( !locked ) {
                    args = args || [];
                    args = [ context, args.slice ? args.slice() : args ];
                    queue.push( args );
                    if ( !firing ) {
                        fire();
                    }
                }
                return this;
            },

            // Call all the callbacks with the given arguments
            fire: function() {
                self.fireWith( this, arguments );
                return this;
            },

            // To know if the callbacks have already been called at least once
            fired: function() {
                return !!fired;
            }
        };

    return self;
};


function Identity( v ) {
    return v;
}
function Thrower( ex ) {
    throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
    var method;

    try {

        // Check for promise aspect first to privilege synchronous behavior
        //首先检查promise以授予同步行为权限
        if ( value && isFunction( ( method = value.promise ) ) ) {
            method.call( value ).done( resolve ).fail( reject );

            // Other thenables
        } else if ( value && isFunction( ( method = value.then ) ) ) {
            method.call( value, resolve, reject );

            // Other non-thenables
        } else {
            // 控制resolve回调时是否传参
            // Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
            // * false: [ value ].slice( 0 ) => resolve( value )
            // * true: [ value ].slice( 1 ) => resolve()
            resolve.apply( undefined, [ value ].slice( noValue ) );
        }

        // For Promises/A+, convert exceptions into rejections
        // Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
        // Deferred#then to conditionally suppress rejection.
        //根据Promises/A+规范将exceptions 异常传递到rejections回调函数，
        //由于jQuery.when不暴露thenables，，我们可以跳过出现在Deferred＃then中的额外检查有条件地抑制rejection。
    } catch ( value ) {

        // Support: Android 4.0 only
        // Strict mode functions invoked without .call/.apply get global-object context
        reject.apply( undefined, [ value ] );
    }
}

jQuery.extend( {

    Deferred: function( func ) {
        var tuples = [

                // action, add listener 监听, callbacks 回调列表, then处理函数 ， 参数索引，终止状态
                // ... .then handlers, argument index, [final state]
                [ "notify", "progress", jQuery.Callbacks( "memory" ),
                    jQuery.Callbacks( "memory" ), 2 ],
                [ "resolve", "done", jQuery.Callbacks( "once memory" ),
                    jQuery.Callbacks( "once memory" ), 0, "resolved" ],
                [ "reject", "fail", jQuery.Callbacks( "once memory" ),
                    jQuery.Callbacks( "once memory" ), 1, "rejected" ]
            ],
            state = "pending",
            promise = {
                state: function() {
                    return state;
                },
                always: function() {//
                    deferred.done( arguments ).fail( arguments );
                    return this;
                },
                "catch": function( fn ) {
                    return promise.then( null, fn );
                },

                // Keep pipe for back-compat
                //doucment的compatMode属性为了告诉开发人员浏览器采用的那种渲染模式,标准模式是CSS1Compat,
                // 混杂模式为BackCompat
                pipe: function( /* fnDone, fnFail, fnProgress */ ) {
                    var fns = arguments;

                    return jQuery.Deferred( function( newDefer ) {
                        jQuery.each( tuples, function( i, tuple ) {

                            // Map tuples (progress, done, fail) to arguments (done, fail, progress)
                            var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

                            //deferred上绑定三种函数
                            // deferred.progress(function() { bind to newDefer or newDefer.notify })
                            // deferred.done(function() { bind to newDefer or newDefer.resolve })
                            // deferred.fail(function() { bind to newDefer or newDefer.reject })
                            deferred[ tuple[ 1 ] ]( function() {
                                var returned = fn && fn.apply( this, arguments );
                                if ( returned && isFunction( returned.promise ) ) {
                                    returned.promise()
                                        .progress( newDefer.notify )
                                        .done( newDefer.resolve )
                                        .fail( newDefer.reject );
                                } else {
                                    newDefer[ tuple[ 0 ] + "With" ](
                                        this,
                                        fn ? [ returned ] : arguments
                                    );
                                }
                            } );
                        } );
                        fns = null;
                    } ).promise();
                },
                then: function( onFulfilled, onRejected, onProgress ) {
                    var maxDepth = 0;
                    function resolve( depth, deferred, handler, special ) {
                        return function() {
                            var that = this,
                                args = arguments,
                                mightThrow = function() {
                                    var returned, then;

                                    // Support: Promises/A+ section 2.3.3.3.3
                                    // https://promisesaplus.com/#point-59
                                    // Ignore double-resolution attempts
                                    if ( depth < maxDepth ) {
                                        return;
                                    }

                                    returned = handler.apply( that, args );

                                    // Support: Promises/A+ section 2.3.1
                                    // https://promisesaplus.com/#point-48
                                    if ( returned === deferred.promise() ) {
                                        throw new TypeError( "Thenable self-resolution" );
                                    }

                                    // Support: Promises/A+ sections 2.3.3.1, 3.5
                                    // https://promisesaplus.com/#point-54
                                    // https://promisesaplus.com/#point-75
                                    // Retrieve `then` only once
                                    then = returned &&

                                        // Support: Promises/A+ section 2.3.4
                                        // https://promisesaplus.com/#point-64
                                        // Only check objects and functions for thenability
                                        ( typeof returned === "object" ||
                                            typeof returned === "function" ) &&
                                        returned.then;

                                    // Handle a returned thenable
                                    if ( isFunction( then ) ) {

                                        // Special processors (notify) just wait for resolution
                                        if ( special ) {
                                            then.call(
                                                returned,
                                                resolve( maxDepth, deferred, Identity, special ),
                                                resolve( maxDepth, deferred, Thrower, special )
                                            );

                                            // Normal processors (resolve) also hook into progress
                                        } else {

                                            // ...and disregard older resolution values
                                            maxDepth++;

                                            then.call(
                                                returned,
                                                resolve( maxDepth, deferred, Identity, special ),
                                                resolve( maxDepth, deferred, Thrower, special ),
                                                resolve( maxDepth, deferred, Identity,
                                                    deferred.notifyWith )
                                            );
                                        }

                                        // Handle all other returned values
                                    } else {

                                        // Only substitute handlers pass on context
                                        // and multiple values (non-spec behavior)
                                        //只有替代处理程序传递上下文和多个值（非规范行为）
                                        if ( handler !== Identity ) {
                                            that = undefined;
                                            args = [ returned ];
                                        }

                                        // Process the value(s) 处理值
                                        // Default process is resolve
                                        ( special || deferred.resolveWith )( that, args );
                                    }
                                },

                                // Only normal processors (resolve) catch and reject exceptions
                                //只有正常的处理器processors（resolve）捕获并拒绝异常
                                process = special ?
                                    mightThrow :
                                    function() {
                                        try {
                                            mightThrow();
                                        } catch ( e ) {

                                            if ( jQuery.Deferred.exceptionHook ) {
                                                jQuery.Deferred.exceptionHook( e,
                                                    process.stackTrace );
                                            }

                                            // Support: Promises/A+ section 2.3.3.3.4.1
                                            // https://promisesaplus.com/#point-61
                                            // Ignore post-resolution exceptions
                                            //忽略 post-resolution  后的异常
                                            if ( depth + 1 >= maxDepth ) {

                                                // Only substitute handlers pass on context
                                                // and multiple values (non-spec behavior)
                                                //只有替代处理程序传递上下文和多个值（非规范行为）
                                                if ( handler !== Thrower ) {
                                                    that = undefined;
                                                    args = [ e ];
                                                }

                                                deferred.rejectWith( that, args );
                                            }
                                        }
                                    };

                            // Support: Promises/A+ section 2.3.3.3.1
                            // https://promisesaplus.com/#point-57
                            // Re-resolve promises immediately to dodge false rejection from
                            // subsequent errors
                            //立即重新Re-resolve promises，以避免后续错误的错误rejection
                            if ( depth ) {
                                process();
                            } else {

                                // Call an optional hook to record the stack, in case of exception
                                // since it's otherwise lost when execution goes async
                                //回调一个可选的钩子记录堆栈，以防异常当执行异步时它会丢失
                                if ( jQuery.Deferred.getStackHook ) {
                                    process.stackTrace = jQuery.Deferred.getStackHook();
                                }
                                window.setTimeout( process );
                            }
                        };
                    }

                    return jQuery.Deferred( function( newDefer ) {

                        // progress_handlers.add( ... )
                        tuples[ 0 ][ 3 ].add(
                            resolve(
                                0,
                                newDefer,
                                isFunction( onProgress ) ?
                                    onProgress :
                                    Identity,
                                newDefer.notifyWith
                            )
                        );

                        // fulfilled_handlers.add( ... )
                        tuples[ 1 ][ 3 ].add(
                            resolve(
                                0,
                                newDefer,
                                isFunction( onFulfilled ) ?
                                    onFulfilled :
                                    Identity
                            )
                        );

                        // rejected_handlers.add( ... )
                        tuples[ 2 ][ 3 ].add(
                            resolve(
                                0,
                                newDefer,
                                isFunction( onRejected ) ?
                                    onRejected :
                                    Thrower
                            )
                        );
                    } ).promise();
                },

                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function( obj ) {
                    return obj != null ? jQuery.extend( obj, promise ) : promise;
                }
            },
            deferred = {};

        // Add list-specific methods
        jQuery.each( tuples, function( i, tuple ) {
            var list = tuple[ 2 ],
                stateString = tuple[ 5 ];

            // promise.progress = list.add  此处是list的add操作,add返回的是callbacks的self，对回调列表list的操作接口
            // promise.done = list.add
            // promise.fail = list.add
            promise[ tuple[ 1 ] ] = list.add;

            // Handle state
            if ( stateString ) {
                list.add(
                    function() {

                        // state = "resolved" (i.e., fulfilled)
                        // state = "rejected"
                        state = stateString;
                    },

                    // rejected_callbacks.disable
                    // fulfilled_callbacks.disable
                    tuples[ 3 - i ][ 2 ].disable,

                    // rejected_handlers.disable
                    // fulfilled_handlers.disable
                    tuples[ 3 - i ][ 3 ].disable,

                    // progress_callbacks.lock
                    tuples[ 0 ][ 2 ].lock,

                    // progress_handlers.lock
                    tuples[ 0 ][ 3 ].lock
                );
            }

            // progress_handlers.fire
            // fulfilled_handlers.fire
            // rejected_handlers.fire
            list.add( tuple[ 3 ].fire );

            // deferred.notify = function() { deferred.notifyWith(...) }
            // deferred.resolve = function() { deferred.resolveWith(...) }
            // deferred.reject = function() { deferred.rejectWith(...) }
            deferred[ tuple[ 0 ] ] = function() {
                deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
                return this;
            };

            // deferred.notifyWith = list.fireWith
            // deferred.resolveWith = list.fireWith
            // deferred.rejectWith = list.fireWith
            deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
        } );

        // Make the deferred a promise
        promise.promise( deferred );

        // Call given func if any
        if ( func ) {
            func.call( deferred, deferred );
        }

        // All done!
        return deferred;
    },

    // Deferred helper
    when: function( singleValue ) {
        var

            // count of uncompleted subordinates
            remaining = arguments.length,

            // count of unprocessed arguments
            i = remaining,

            // subordinate fulfillment data
            resolveContexts = Array( i ),
            resolveValues = slice.call( arguments ),

            // the master Deferred
            master = jQuery.Deferred(),

            // subordinate callback factory
            updateFunc = function( i ) {
                return function( value ) {
                    resolveContexts[ i ] = this;
                    resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
                    if ( !( --remaining ) ) {
                        master.resolveWith( resolveContexts, resolveValues );
                    }
                };
            };

        // Single- and empty arguments are adopted like Promise.resolve
        if ( remaining <= 1 ) {
            adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
                !remaining );

            // Use .then() to unwrap secondary thenables (cf. gh-3000)
            if ( master.state() === "pending" ||
                isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

                return master.then();
            }
        }

        // Multiple arguments are aggregated like Promise.all array elements
        while ( i-- ) {
            adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
        }

        return master.promise();
    }
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

    // Support: IE 8 - 9 only
    // Console exists when dev tools are open, which can happen at any time
    if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
        window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
    }
};

