export function getUserList () {


  //this.users.push({userWho: this.username});
  //this.users.userWho == this.username;
  console.log(this.users.length);
  if(username == "admin"){  //管理员
    //alert("管理员");
    this.$axios.get(this.getIP() + 'admin/users',{
      //设置头
      headers:{
        'content-type':'application/x-www-form-urlencoded'
      },
      auth: {
        username: username,
        password: password
      }
    }).then(res=>{
      return users = res.data.data
    })
      .catch(err=>{
        console.log(err);
      })
  }else{    //普通用户
    console.log(this.users.length);
    //alert("普通用户");
    this.$axios.get(this.getIP() + 'users/' + userId,{

      //设置头
      headers:{
        'content-type':'application/x-www-form-urlencoded'
      },
      auth: {
        username: this.username,
        password: password
      }
    }).then(res=>{
      return editor = res.data.data
    })
      .catch(err=>{
        console.log(err);
      })

  }
}
