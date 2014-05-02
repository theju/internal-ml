// ml

// Put your plugin code here
// type: `haraka -h Plugins` for documentation on how to create a plugin

var outbound = require("./outbound");

exports.hook_data = function(next, connection) {
    var transaction = connection.transaction;
    transaction.parse_body = true;
    next();
}

exports.hook_queue = function(next, connection) {
    connection.relaying = true;
    var transaction = connection.transaction;
    var domain = this.config.get("host_list")[0];
    var lists = this.config.get("lists.json", "json")
    var plugin = this;
    if (transaction.mail_from.host === domain) {
	var recipients = [];
	transaction.message_stream.get_data(function (contents) {
	    contents = contents.replace(/\r/g, '');
	    for (var ii=0; ii < transaction.rcpt_to.length; ii++) {
                var list = transaction.rcpt_to[ii];
                var users = lists[list.user];
                for (var jj=0; jj < users.length; jj++) {
                    var user = users[jj];
                    if (user !== transaction.mail_from.address()) {
	    		recipients.push(user);
	    	    }
	    	}
	    }
	    outbound.send_email(transaction.mail_from, recipients, contents, function (code, msg) {
	    	switch (code) {
	    	case DENY:
	    	    plugin.logerror("Sending mail failed: " + msg);
	    	    break;
	    	case OK:
	    	    plugin.loginfo("mail sent");
		    next(OK);
	    	    break;
	    	default:
	    	    plugin.logerror("Unrecognised return code from sending email: " + msg);
	    	}
	    });
	});
    } else {
	next(DENY, ["Only " + domain + " users are allowed to send a mail to this list"]);
    }
}
