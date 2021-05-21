module.exports.getdate=getdate;
function getdate(){
    let today= new Date();
    let opt={
        weekday:"long",
        month:"long",
        day:"numeric"
    };
    let date=today.toLocaleDateString(today,opt);
    return date;
}