const Model = require('./../model.js')

module.exports = class Hero extends Model {
    constructor(name, description, class_role, race) {
        super(name, description, class_role, race)
    }
    find(id) {
        super.find(id)
    }
    delete() {
        super.delete()
    }
    save() {
        super.save()
    }
}