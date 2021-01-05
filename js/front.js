let getUserData = function (user_name){
    let aPromise = octokit.users.getByUsername({ username: user_name })

    aPromise.then(
    function(result){
        displayUserData(result.data)
    },
    function(error){
        console.log(error)
    })
}

let getRepoCommits = function (cur_repo){
    let commitPromise = octokit.repos.getContributorsStats({
        owner: input,
        repo: cur_repo,
    });

    let contributors = [];


    commitPromise.then(
    function(result){
        
        for(var i in result.data){

            let weeks = [];
            let commits = [];
            var author = result.data[i].author.login
            
            for(var j in result.data[i].weeks){
                var cur = result.data[i].weeks[j]
                weeks.push(j)
                commits.push(cur.c)
            }

            contributors.push({author, weeks: weeks, commits: commits})
        }
        console.log(contributors)
        drawLineChart(contributors)
    },
    function(error){
        console.log(error)
    })
}

let drawLineChart = function (cur_data){
    var data = []

    for(var i in cur_data){
        var tmp = cur_data[i]
        var trace = {
            x: tmp.weeks,
            y: tmp.commits,
            mode: 'lines',
            name: tmp.author,
            line: {
              dash: 'solid',
              width: 4
            }
        };

        data.push(trace)
    }

    var layout = {
        title: 'Line Dash',
        xaxis: {
            title: 'Weeks',
            range: [0.75, 5.25],
            autorange: true
        },
        yaxis: {
            title: 'Commit Counts',
            range: [0, 18.5],
            autorange: true
        },
        legend: {
          y: 0.5,
          traceorder: 'reversed',
          font: {
            size: 16
          }
        }
      };
      
      Plotly.newPlot('lineDiv', data, layout);
}

let getRepoLanguages = function (cur_repo){
    let curRepoPromise = octokit.repos.listLanguages({
        owner: input,
        repo: cur_repo
    })

    curRepoPromise.then(
        function(result){
            drawPieChart(result.data)
        },
        function(error){
            console.log(error)
        }
    )
}

let drawPieChart = function (cur_data){
    let val = [];
    let keys = [];

    for(var i in cur_data){
        val.push(cur_data[i])
        keys.push(i)
    }

    var data = [{
        values: val,
        labels: keys,
        type: 'pie'
    }];
      
    var layout = {
        height: 400,
        width: 500
    };
      
    Plotly.newPlot('pieDiv', data, layout);
}

let displayUserData = function (user_info){
    document.getElementById("userInfo").innerHTML = `<img src="${user_info.avatar_url}" style="margin-top:0px ; align:left"></img><br/>
    <p class="user-text">
    Username: ${user_info.login}  \n<br/>
    Name: ${user_info.name == null ? "Unknown" : user_info.name}  \n<br/>
    Email: ${user_info.email == null ? "Unknown" : user_info.email}  \n<br/>
    Followers: ${user_info.followers}  \n<br/>
    Following: ${user_info.following}  \n<br/>
    Bio: ${user_info.bio == null ? "Unknown" : user_info.bio}  \n<br/>
    Public Repos: ${user_info.public_repos}  \n<br/>
    Hireable: ${user_info.hireable == null ? "Unknown" : data.hireable}  \n<br/>
    Type: ${user_info.type}</p>  \n`
}

let displayRepos = function (user_repos){
    var repo_name;
    document.getElementById("dropDownRepo").innerHTML = ""
    try {
        for (var key in user_repos.data){
            repo_name = user_repos.data[key].name
            document.getElementById("dropDownRepo").innerHTML += `<option onclick="getRepoLanguages('${repo_name}');getRepoCommits('${repo_name}');">${repo_name}</option>`
        }
    }
    catch (e) {
        console.error(`Could not add repo to dropdown... Skipping \n ${e}`)
    }
}

let run = function (input_name){
    let repoPromise = octokit.repos.listForUser({
        username: input_name
    })

    repoPromise.then(
        function(result){
            console.log(result.data)
            getUserData(input)
            displayRepos(result)
        },
        function(error){
            console.log(error)
        })
}

let search = document.getElementById("search_form")
if(search){
    search.addEventListener("submit", theBar => {
        theBar.preventDefault()
        runSearch(document.getElementById("userName").value, (document.getElementById("authToken").value !== "" ? document.getElementById("authToken").value : undefined))
    })
}

let octokit
let input

let runSearch = function (input_name, input_token){
    input = input_name
    if(input_name === null){
        window.location.reload(false)
    }
    else{
        if(input_token !== undefined){
            octokit = Octokit({
                auth: input_token,
                userAgent: 'GitHub API Access and Visualisation'
            });
        }
        else {
            console.log("No Access Token Found! \n Rates will be limited.")
            octokit = Octokit({
                userAgent: 'GitHub API Access and Visualisation'
            });
        }
    }
    outputResultLocator()
    run(input)
}

let outputResultLocator = function(){
    document.getElementById("output_result").innerHTML 
    = '<select id="dropDownRepo" onmousedown="if(this.options.length>10){this.size=10;}" onchange="this.size=0;" onblur="this.size=0;"></select><div id="userInfo"></div>'
}
