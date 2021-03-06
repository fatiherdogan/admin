App.SwitchCapabilityView = Em.View.extend({
    templateName: 'capabilities/switch',

    actions: {
        sendSwitch: function() {
            var self = this;
            var newState = this.switchManager.state === 0.0 ? 1.0 : 0.0;
            var switchId = this.get('principal.id');

            var command = new nitrogen.Message({
                to:     switchId,
                type:   'switchCommand',
                tags:   [ nitrogen.CommandManager.commandTag(switchId) ],
                body: {
                    on: newState
                }
            });

            command.send(App.session, function(err, messages) {
                if (err) console.log('sending command failed: ' + err);
            });
        },
        sendMotion: function() { this.sendCommand('motion'); }
    },

    commands: function() {

        var ret = Em.A();
        if (!this.switchManager) return Em.A([]);

        this.switchManager.messageQueue.forEach(function(message) {
            ret.pushObject(message);
        });

        return ret;
    }.property('invalidation'),

    invalidation: null,

    init: function() {
        this.switchManager = new nitrogen.SwitchManager(this.get('principal'));
        var self = this;

        this.switchManager.start(App.session, function(err, message) {
            if (!self.isDestroyed) self.set('invalidation', new Date());
        });
    }
});
