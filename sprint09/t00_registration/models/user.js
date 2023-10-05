const Model = require('./../model.js')

module.exports = class User extends Model {
	constructor(login, full_name, email, password){
		super(login, full_name, email, password);
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
