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
    // console.log('reached')
    console.log(profile)
    let username = profile.displayName
    let userId = profile.id
    let name = profile.name.givenName
    let email = profile.emails[0].value
    let provider = profile.provider
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
              CREATE (n:USER {userId: $userId}) 
              SET n.username = $username
              SET n.name = $name
              SET n.email = $email
              SET n.provider = $provider
            `,
            {userId: userId, 
            username: username,
            name:name,
            email:email,
            provider:provider
          
          }
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