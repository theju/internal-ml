// ml

// Put your plugin code here
// type: `haraka -h Plugins` for documentation on how to create a plugin

var outbound = require("./outbound");
var async = require("async");

exports.hook_data = function(next, connection, params) {
    var transaction = connection.transaction;
    transaction.parse_body = true;
    var domain = this.config.get("host_list")[0];
    var lists = this.config.get("lists.json", "json")
    var plugin = this;
    var outnext = function (code, msg) {
        switch (code) {
	    case DENY:
	        plugin.logerror("Sending mail failed: " + msg);
	        break;
	    case OK:
	        plugin.loginfo("mail sent");
	        next();
	        break;
	    default:
	        plugin.logerror("Unrecognised return code from sending email: " + msg);
	        next();
	}
    };
    if (transaction.mail_from.host === domain) {
	transaction.message_stream.get_data(function (contents) {
	    contents = contents.replace(/\r/g, '');
	    async.each(transaction.rcpt_to, function(list, cb) {
		var users = lists[list.user];
		if (users) {
		    async.each(users, function(user, cb2) {
			if (user !== transaction.mail_from.address()) {
			    outbound.send_email(transaction.mail_from, user, contents, outnext);
			}
		    });
		}
	    });
	});
	next();
    }
}
