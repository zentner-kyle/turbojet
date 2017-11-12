Kelvin JS
=========

This library allows "script tags" to be attached to the page, which can be hot reloaded.
Not in any clever way, just by re-running the script without reloading the page.

By default, no updates are run. To trigger an update, call updateKelvinScripts.

The implementation has no dependencies, but is incredibly naive and uses ES2015 features.
