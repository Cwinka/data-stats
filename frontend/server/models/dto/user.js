module.exports =  function UserDTO(model){
    this.id = model._id;
    this.email = model.email;
    this.isActivated = model.isActivated;
}