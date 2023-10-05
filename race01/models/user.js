import Model from './../model.js';

export default class User extends Model {
	constructor(name, email, password, avatar){
		super(name, email, password, avatar);
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
