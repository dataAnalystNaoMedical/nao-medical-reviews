// set default dates in datepickers
const reqBody = JSON.stringify({
    "dataSource": "Cluster0",
    "database": "naoMedical",
    "collection": "reviews",
    "pipeline": [
      {
        "$project": {
          "review": 1,
          "rating": 1,
          "updateTime": 1,
          "location_name": 1,
          "created_on": 1,
          "owner": 1
        }
      },
      {
        "$addFields": {
          "created_at": {
            "$dateFromString": {
              "dateString": "$updateTime"
            }
          }
        }
      },
      {
        "$sort": {
          "updateTime": -1
        }
      },
      {
        "$limit": 10
      }
    ]
  });


console.log(" running now at ", new Date());

async function reviewsFetch(forDate) {
    console.log("getting reviews from api route for date : ",forDate);
    // const reviewsDataRaw = await fetch("http://localhost:3000/api/getAll");
    // const reviewsDataRaw = await fetch("/api/getOneReview", {
    //     body: null,
    //     method: 'GET',
    //     mode: 'cors',
    // });

    /* vercel api hosted  : https://nao-medical-reviews-dubeyji.vercel.app/api/getAll */
    const reviewsDataRaw = await fetch("https://data.mongodb-api.com/app/data-firwq/endpoint/data/v1/action/aggregate", {
        
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          'api-key':'NEQ51O0oeZJOLpLB2vw1pAR8BPQelGv4JduUMasFN9RHpPMa9w1MJqK1EmXQzauU',
          'Access-Control-Request-Headers':'*'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(forDate)
    });
    let response = await reviewsDataRaw.json();
    getDataForDatatables(response.message);
    return response.message;
}


const getReviewsBtn = document.getElementById('getData');
getReviewsBtn.addEventListener('click', async () => {
    let dateReview1 = document.getElementById('dateSelector1');
    let dateReview2 = document.getElementById('dateSelector2');
    console.log("getting reviews for : ",dateReview1.value,' --- ',dateReview2.value);
    // let input = dateReview.value;
    // let dateEntered = new Date(input);
    console.log('request to fetch reviews made at : ', new Date());
    let reviewCollection = await reviewsFetch({'dates':[dateReview1.value , dateReview2.value]});
    console.log("total reviews returned : ", reviewCollection.length);
    // document.getElementById('reviews_data').textContent = JSON.stringify(reviewCollection);

});




function getDataForDatatables(reviewsJson) {
    var jsonData = {
        "data": reviewsJson
    };
    setDataToTable(jsonData);
}

function setDataToTable(jsonData) {
    console.log("__________2__________");
    console.log(jsonData);
    console.log("\n\n ......................... set data to datatable ......................... \n\n");
    $('#tableTopic').DataTable({
        pagination: "bootstrap",
        filter: true,
        data: jsonData.data,
        destroy: true,
        lengthMenu: [100, 50, 25, 10],
        pageLength: 50,
        "columns": [
            {
                "data": "created_on",
                render: function (data) {
                    // return new Date(data).toLocaleString('default', {month:'long', year:'numeric', day:'numeric', hour: 'numeric', minute:'numeric'});
                   // return new Date(data).toLocaleString();
//                     return new Date(data);
//                     return new Date(data).toDateString();
                    return new Date(data).toLocaleString('en-US', {
                      timeZone: 'America/New_York',
                    });
                }
            },
            {
                "data": "review",
                render: function (data) {
                    if(data){
                        return `${data}`;
                    }
                    else{
                        return 'No Comment Added'
                    }
                },
            },
            {
                "data": "owner",
                render: function (data) {
                    return `${data}`;
                },
            },
            {
                "data": "location_name"
            },
            {
                "data": "rating",
                render: function(data){
                    if(data){
                        return data
                    }
                    else{
                        return 0
                    }
                }
            }
        ],

        order: [[4, 'desc']],
    });
}


