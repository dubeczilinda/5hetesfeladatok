function getData(url, callbackFunc) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status == 200) {
            callbackFunc(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}


function successAjax(xhttp) {
    // itt a json content, benne a data változóban
    //var userDatas = JSON.parse(xhttp.responseText);
    var userDatas = (JSON.parse(xhttp.responseText))[0].users;
    console.log(userDatas);
    /*
      Pár sorral lejebb majd ezt olvashatod:
      IDE ÍRD A FÜGGVÉNYEKET!!!!!! NE EBBE AZ EGY SORBA HANEM INNEN LEFELÉ!

      Na azokat a függvényeket ITT HÍVD MEG! 

      A userDatas NEM GLOBÁLIS változó, ne is tegyétek ki globálisra. Azaz TILOS!
      Ha valemelyik függvényeteknek kell, akkor paraméterként adjátok át.
    */
   
   createHeaders(headerData);
   creatTable(userDatas, headLine);
   statistic(userDatas);

   document.getElementById("before1990").addEventListener("click",function(){
    showBefore1990(userDatas)
    });
    document.getElementById("first3").addEventListener("click",function(){
    first3(userDatas)
    });
    document.getElementById("names").addEventListener("click",function(){
    names(userDatas)
    });
    document.getElementById("cities").addEventListener("click",function(){
    cities(userDatas)
    });
    document.getElementById("before2000").addEventListener("click",function(){
    before2000(userDatas)
    });
}

getData('/felkeszules/js/users.json', successAjax);

// Live servert használd mindig!!!!!
/* IDE ÍRD A FÜGGVÉNYEKET!!!!!! NE EBBE AZ EGY SORBA HANEM INNEN LEFELÉ! */

var headerData = ['Azonosító', 'Felhasználónév', 'Jelszó', 'Vezetéknév', 'Keresztnév', 'Ország', 'Állam/Megye',
         'Irányítószám', 'Város', 'Cím', 'Nem', 'Születési dátum', 'Email cím', 'Telefonszám'
        ];
var headLine = ["id", "username", "password", "firstname", "lastname", "country", "state", "zipcode",
    "city", "address", "sex", "birthdate", "email", "phone"
        ];
var table = document.createElement('table');
var thead = document.createElement('thead');
var headerTr = document.createElement('tr');
var tbody = document.createElement('tbody');
var tableContainer = document.getElementById('table_container');
        
thead.appendChild(headerTr);
table.border = 1;
table.appendChild(thead);
table.appendChild(tbody);
tableContainer.appendChild(table);

// A fejlécek legenerálása
function createHeaders() {
    for (var i = 0; i < headerData.length; i++) {
        th = document.createElement('th');
        th.innerText = headerData[i];
        headerTr.appendChild(th);
    }
}

// A táblázat legenerálása
function createTable() {
       for (var i = 0; i < userDatas.length; i++) {
        var tr;
        tr = document.createElement('tr');
        tbody.appendChild(tr);

        for (var j = 0; j < headLine.length; j++) {
            var td;
            td = document.createElement('td');
            td.innerText = userDatas[i].headLine[j];
            tr.appendChild(td);
        }
    }
}

//Egyes funkciók közötti törlés
function resetTable() {
    document.querySelector('thead').innerHTML = '';
    document.querySelector('tbody').innerHTML = '';
}


function showBefore1990(data) {
    resetTable();
    var head1 = ["Felhasználónév"];
    var headline1 = ["username"];
    var fiatal = data.filter(function (item) {
        var date1 = new Date(item.birthdate);
        if (date1.getFullYear() < 1990) {
            return true;
        }
        return false;

    });
    createHead(head1);
    createContent(fiatal, headline1);
}

function first3(data) {
    resetTable();
    var head1 = ["Vezetéknév", "Keresztnév", "Születési dátum"];
    var headline1 = ["firstname", "lastname", "birthdate"];
    data.sort(function (a, b) {
        var date1 = new Date(a.birthdate);
        var date2 = new Date(b.birthdate);
        return date2 - date1;
    });
    data = data.filter(function (item, index) {
        if (index < 3) {
            return true;
        }
        return false;
    })
    createHead(head1);
    createContent(data, headline1);
}

function names(data) {
    resetTable();
    var head1 = ["Vezetéknév", "Keresztnév"];
    var headline1 = ["firstname", "lastname"];
    data = data.filter(function (item) {
        var date1 = new Date(item.birthdate);
        if (date1.getFullYear() >= 1990 && date1.getFullYear() <= 2000 && item.sex == "férfi" && item.city == "Budapest" && item.state != "") {
            return true;
        }
        return false;
    });
    data = data.sort(function (a, b) {
        if (a.lastname > b.lastname) {
            return 1;
        }
        return -1;
    });
    data = data.sort(function (a, b) {
        if (a.firstname > b.firstname) {
            return 1;
        }
        return -1;
    });
    createHead(head1);
    createContent(data, headline1);
}

function cities(data) {
    resetTable();
    var head1 = ["Város", "Lakosok"];
    var headline1 = ["city", "lakos"];
    var data1 = [];
    var datavaros = [];
    for (var i in data) {
        if (!data1.includes(data[i].city)) {
            data1.push(data[i].city);
            datavaros.push({
                city: data[i].city,
                lakos: 0
            });
        }
        for (var j in datavaros) {
            if (datavaros[j].city == data[i].city) {
                datavaros[j].lakos++;
            }
        }
    }
    createHead(head1);
    createContent(datavaros, headline1);
}

function before2000(data) {
    resetTable();
    var head1 = ["Vezetéknév", "Keresztnév", "Felhasználónév", "E-mail cím", "Telefonszám"];
    var headline1 = ["firstname", "lastname", "username", "email", "phone"];
    data = data.filter(function (item) {
        var date1 = new Date(item.birthdate);
        if (date1.getFullYear() < 2000 || item.city != "Budapest") {
            return true;
        }
        return false;

    });
    createHead(head1);
    createContent(data, headline1);
}



// A statisztikai adatok kiirását végző fügvény

function statistic(data) {
    var text = document.createElement('p');
    text.setAttribute('id', 'stat');
    var sum = 0;
    var now = new Date();
    data.sort(function (a, b) {
        var date1 = new Date(a.birthdate);
        var date2 = new Date(b.birthdate);
        return date1 - date2;
    });
    for (var i in data) {
        date1 = new Date(data[i].birthdate);
        sum += now.getFullYear() - date1.getFullYear();
    }
    legido = data[0];
    legfia = data[data.length - 1];
    var avg = Math.round((sum / data.length * 100)) / 100;
    text.innerHTML = `A legidősebb ember felhasználóneve: ${legido.username} születési ideje:  ${legido.birthdate}` <br>
                    `A legfiatalabb ember felhasználóneve: ${legfia.username} születési ideje:  ${legfia.birthdate}` <br>
                    `Átlagéletkor: ${avg} `<br>
                    `Összegzett életkor: ${sum}`
    ;
    document.querySelector('#stat').appendChild(text);
}
