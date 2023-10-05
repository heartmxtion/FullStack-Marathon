const Model = require('./../model.js')

module.exports = class User extends Model {
	constructor(login, full_name, email, password, role){
		super(login, full_name, email, password, role);
	}
	find(id){
		super.find(id);
	}
	delete(){
		super.delete();
	}
	save(){
		super.save();
	}
}
