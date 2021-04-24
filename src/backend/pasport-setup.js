const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var neo4j = require('neo4j-driver')
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "todo"))
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "925311843463-gipe7mg8oab5llk3ougfirj5s2epnk3d.apps.googleusercontent.com",
    clientSecret: "_x7JZ3QcaKwS6kussCLFpJt0",
    callbackURL: "http://localhost:4000/google/callback"
  },
  async(accessToken,refreshToken, profile, done )=>{
    // console.log(profile)
    let username = profile.displayName
    let userId = profile.id
    const session = driver.session();
    const result = await session.run(
      `
       MATCH (n:USER {userId: $userId}) RETURN n
      
      
    `,
    {userId: userId, username: username }
    );
    
    if(result.records.length===0){
      const result1 = await session.run(
              `
              MATCH (n:USER {userId: $userId}) 
              CREATE (n:USER {userId: $userId}) 
              SET n.username = $username
              
            `,
            {userId: userId, username: username }
            );
        done(null, profile)
    }
    else{
      console.log("user already exists")
      done(null, profile)
    }
      await session.close();
  }
));