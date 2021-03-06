App.CameraCapabilityView = Em.View.extend({
    templateName: 'capabilities/camera',

    actions: {
        sendSnapshot: function() { this.sendCommand('snapshot'); },
        sendMotion: function() { this.sendCommand('motion'); }
    },

    commands: function() {
        var ret = Em.A();
        if (!this.cameraManager) return Em.A([]);

        this.cameraManager.messageQueue.forEach(function(message) {
            ret.pushObject(message);
        });

        return ret;
    }.property('invalidation'),

    invalidation: null,

    init: function() {
        this.cameraManager = new nitrogen.CameraManager(this.get('principal'));
        var self = this;

        this.cameraManager.start(App.session, function(err, message) {
            if (!self.isDestroyed) self.set('invalidation', new Date());
        });
    },

    sendCommand: function(cmd) {
        var cameraId = this.get('principal.id');

        var command = new nitrogen.Message({
            to: cameraId,
            type: 'cameraCommand',
            tags: [ nitrogen.CommandManager.commandTag(cameraId) ],
            body: {
                command: cmd
            }
        });

        command.send(App.session, function(err, messages) {
            if (err) console.log('sending command failed: ' + err);
        });
    }
});
