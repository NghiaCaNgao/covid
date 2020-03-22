var data;
let covid = [];
let countries = [];
let bookmark = ['vietnam', 'china', 'cambodia', "italy"];

const vn_nhiem = document.querySelector("#vn_nhiem h1");
const vn_chua = document.querySelector("#vn_chua h1");
const vn_chet = document.querySelector("#vn_chet h1");
const vn_hang_nhiem = document.querySelector("#vn_nhiem h3");
const vn_hang_chua = document.querySelector("#vn_chua h3");
const vn_hang_chet = document.querySelector("#vn_chet h3");

const search = document.getElementById("search");

const tg_nhiem = document.querySelector("#tg_nhiem h2");
const tg_chua = document.querySelector("#tg_chua h2");
const tg_chet = document.querySelector("#tg_chet h2");
const sort_c = document.getElementById("sort_c");
const sort_r = document.getElementById("sort_r");
const sort_d = document.getElementById("sort_d");
const gr_ranking = document.getElementById("ranking");

function trim(str) {
    while (str.lastIndexOf(",") > -1) {
        str = str.replace(",", "");
    }
    while (str.lastIndexOf(" ") > -1) {
        str = str.replace(" ", "");
    }
    while (str.lastIndexOf("*") > -1) {
        str = str.replace("*", "");
    }
    while (str.lastIndexOf("(") > -1) {
        str = str.replace("(", "");
    }
    while (str.lastIndexOf(")") > -1) {
        str = str.replace(")", "");
    }
    while (str.lastIndexOf("'") > -1) {
        str = str.replace("'", "");
    }
    while (str.lastIndexOf(".") > -1) {
        str = str.replace(".", "");
    }
    return str;
}

function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}

function intoInt(str) {
    if (typeof(str) == "string") {
        str = trim(str);
        str = Number(str);
        return str;
    } else return str;
}

function count(quocgia) {
    var c_confirmed = 0;
    var c_recovered = 0;
    var c_deaths = 0;
    var c_index = -1;

    if (!quocgia) {
        covid.forEach(val => {
            c_confirmed += val.confirmed;
            c_recovered += val.recovered;
            c_deaths += val.deaths;
        });
    } else {
        for (let val of covid) {
            c_index++;
            if (val.country === quocgia) {
                c_confirmed = val.confirmed;
                c_recovered = val.recovered;;
                c_deaths = val.deaths;
                break;
            }
        }
    }
    return {
        confirmed: c_confirmed,
        recovered: c_recovered,
        deaths: c_deaths,
        index: c_index
    }
}

function sort(type) {
    let tmp = covid;
    let z;
    switch (type) {
        case "confirmed":
            {
                for (let i = 0; i < covid.length; i++) {
                    for (let j = i + 1; j < covid.length; j++) {
                        if (tmp[i].confirmed < tmp[j].confirmed) {
                            z = tmp[i];
                            tmp[i] = tmp[j];
                            tmp[j] = z;
                        }
                    }
                }
                break;
            }
        case "recovered":
            {
                for (let i = 0; i < covid.length; i++) {
                    for (let j = i + 1; j < covid.length; j++) {
                        if (tmp[i].recovered < tmp[j].recovered) {
                            z = tmp[i];
                            tmp[i] = tmp[j];
                            tmp[j] = z;
                        }
                    }
                }
                break;
            }
        case "deaths":
            {
                for (let i = 0; i < covid.length; i++) {
                    for (let j = i + 1; j < covid.length; j++) {
                        if (tmp[i].deaths < tmp[j].deaths) {
                            z = tmp[i];
                            tmp[i] = tmp[j];
                            tmp[j] = z;
                        }
                    }
                }
                break;
            }
        default:
            {
                console.log("Loi");
            }
    }
    return tmp;
}



function getSortType() {
    return window.localStorage.sortType || "confirmed";
}

function setSortType(sorttype) {
    window.localStorage.setItem("sortType", sorttype);
}

function getBookMark() {
    if (window.localStorage.bookmark) {
        return (JSON.parse(window.localStorage.bookmark));
    } else return [];
}

function setBookMark(bm) {
    window.localStorage.setItem("bookmark", JSON.stringify(bm));
}

function addBookMark(val) {
    let t = getBookMark();
    t.push(val)
    setBookMark(t);
}

function removeBookMark(val) {
    let t = getBookMark();
    var index = t.indexOf(val);
    if (index !== -1) t.splice(index, 1);
    setBookMark(t);

}

function findBookMark(val) {
    return getBookMark().lastIndexOf(val);
}

function findRanking(type, country) {
    let arr = sort(type);
    let c_index = 0;
    for (let val of arr) {
        c_index++;
        if (val.country === country) break;
    }
    return c_index;
}

function findCountryByRank(type, rank) {
    let arr = sort(type);
    return trim(arr[rank - 1].country);
}

function findCountryByName(name) {
    for (let i = 0; i < covid.length; i++) {
        let m = trim(change_alias(covid[i].country));
        if (m.search(name) > -1) {
            return m;
        }
    }
    return;
}

function createPanel(type, country, confirmed, recovered, deaths, index) {
    let t = trim(country)
    if (type === "ranking") {
        let Ppanel = document.getElementById("ranking");
        let panel = document.createElement("div");
        let id = t;
        panel.classList.add("align", "panel");
        panel.id = t;
        panel.title = t.toUpperCase();
        panel.innerHTML = '<div class="panel_r"></div><div class="align panel_qg"> <h1></h1> </div><div class="panel_c"> <h1 class="align_text c"></h1> <h1 class="align_text r"></h1> <h1 class="align_text d"></h1> </div><div class=" panel_b align"> <button></button></div>';
        Ppanel.appendChild(panel);
        let panel_r = document.querySelector(`#${id} .panel_r`);
        let panel_qg = document.querySelector(`#${id} .panel_qg h1`);
        let panel_c_c = document.querySelector(`#${id} .panel_c .c`);
        let panel_c_r = document.querySelector(`#${id} .panel_c .r`);
        let panel_c_d = document.querySelector(`#${id} .panel_c .d`);
        let panel_b = document.querySelector(`#${id} .panel_b button`);

        if (t.toUpperCase().length > 12) {
            panel_qg.innerHTML = t.toUpperCase().substr(0, 9) + "..."
        } else {
            panel_qg.innerHTML = t.toUpperCase();
        }
        panel_r.innerHTML = index.toString();
        panel_c_c.innerHTML = confirmed.toString();
        panel_c_r.innerHTML = recovered.toString();
        panel_c_d.innerHTML = deaths.toString();
        panel_b.innerHTML = '<i class="far fa-star"></i>';
        if (findBookMark(country) > -1) {
            panel_b.innerHTML = '<i class="fas fa-star"></i>';
        }
        panel_b.addEventListener("click", function() {
            if (findBookMark(country) > -1) {
                removeBookMark(country);
                createBookMark(getBookMark());
                panel_b.innerHTML = '<i class="far fa-star"></i>';
            } else {
                addBookMark(country);
                createBookMark(getBookMark());
                panel_b.innerHTML = '<i class="fas fa-star"></i>';
            }


        })
    } else if (type === "bookmark") {
        let Ppanel = document.getElementById("bookmark");
        let panel = document.createElement("div");
        let id = 'bm_' + t;
        panel.classList.add("align", "panel");
        panel.id = id;
        panel.title = t.toUpperCase();
        panel.innerHTML = '<div class="panel_r"></div><div class="align panel_qg"> <h1></h1> </div><div class="panel_c"> <h1 class="align_text c"></h1> <h1 class="align_text r"></h1> <h1 class="align_text d"></h1> </div><div class=" panel_b align"> <button></button></div>';
        Ppanel.appendChild(panel);
        let panel_r = document.querySelector(`#${id} .panel_r`);
        let panel_qg = document.querySelector(`#${id} .panel_qg h1`);
        let panel_c_c = document.querySelector(`#${id} .panel_c .c`);
        let panel_c_r = document.querySelector(`#${id} .panel_c .r`);
        let panel_c_d = document.querySelector(`#${id} .panel_c .d`);
        let panel_b = document.querySelector(`#${id} .panel_b button`);

        if (t.toUpperCase().length > 12) {
            panel_qg.innerHTML = t.toUpperCase().substr(0, 9) + "..."
        } else {
            panel_qg.innerHTML = t.toUpperCase();
        }
        panel_r.innerHTML = index.toString();
        panel_c_c.innerHTML = confirmed.toString();
        panel_c_r.innerHTML = recovered.toString();
        panel_c_d.innerHTML = deaths.toString();
        panel_b.innerHTML = '<i class="fas fa-star"></i>';
        panel_b.addEventListener("click", function() {
            removeBookMark(country);
            document.querySelector(`#${t} .panel_b button`).innerHTML = '<i class="far fa-star"></i>'
            this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
        })
    }
}

function createRanking(data) {
    document.getElementById("ranking").innerHTML = '';
    data.forEach((val, index) => {
        createPanel("ranking", val.country, val.confirmed, val.recovered, val.deaths, index + 1);
    });
}

function createBookMark(bm) {
    let data = []
    bm.forEach(val => {
        covid.forEach(v => {
            if (val === v.country) data.push(v);
        })
    });
    document.getElementById("bookmark").innerHTML = '';
    data.forEach((val, index) => {
        createPanel("bookmark", val.country, val.confirmed, val.recovered, val.deaths, index + 1);
    });
}

function readData() {
    let af = data.data.covid19Stats;
    let tmp = {};

    af.forEach(entry => {
        if (countries.lastIndexOf(entry.country.toLowerCase()) == -1) {
            tmp = {
                country: entry.country.toLowerCase(),
                province: [],
                confirmed: 0,
                recovered: 0,
                deaths: 0
            }
        } else {
            tmp = covid[countries.lastIndexOf(entry.country.toLowerCase())];
        }

        if (entry.province != "") {
            tmp.province.push({
                name: entry.province,
                confirmed: entry.confirmed,
                recovered: entry.recovered,
                deaths: entry.deaths
            });
        }
        tmp.confirmed += entry.confirmed;
        tmp.recovered += entry.recovered;
        tmp.deaths += entry.deaths;

        if (countries.lastIndexOf(entry.country.toLowerCase()) == -1) {
            covid.push(tmp);
            countries.push(entry.country.toLowerCase());
        } else {
            covid[countries.lastIndexOf(entry.country.toLowerCase())]
        }
    });
}

function readData2() {
    let af = data.data;
    let tmp = {};

    af.forEach(entry => {
        countries.push(af.country);
        tmp = {
            country: entry.country.toLowerCase(),
            province: [],
            confirmed: 0,
            recovered: 0,
            deaths: 0
        }
        tmp.confirmed = intoInt(entry.cases);
        tmp.recovered = intoInt(entry.recovered);
        tmp.deaths = intoInt(entry.deaths);

        covid.push(tmp);
    });
}
async function getData() {
    var url = "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats?country=";
    var url = "./get.php";
    await fetch(url, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
                "x-rapidapi-key": "8717a91f22msha8b1658c3c618a6p1a6a52jsn8aa2c29b1723"
            }
        })
        .then(async res => {
            data = await res.json();
            readData2();
        })
        .catch(err => {
            console.log(err);
        });
}

sort_c.addEventListener("click", function() {
    gr_ranking.innerHTML = "";
    setSortType("confirmed");
    createRanking(sort("confirmed"));
});
sort_r.addEventListener("click", function() {
    gr_ranking.innerHTML = "";
    setSortType("recovered");
    createRanking(sort("recovered"));
});

sort_d.addEventListener("click", function() {
    gr_ranking.innerHTML = "";
    setSortType("deaths");
    createRanking(sort("deaths"));
});
search.addEventListener("click", function() {
    this.value = "";
})
search.addEventListener("keypress", function(key) {
    if (search.val != "") {
        if (key.code === "Enter" || key.code === "Ok") {
            let text = search.value;
            if (isNaN(Number(text)) == 0) {
                let stt = Number(text);
                if (stt > 0 && stt <= covid.length) {
                    let e = document.getElementById(`${findCountryByRank(getSortType(),stt)}`);
                    e.scrollIntoView();
                } else {
                    alert("Số stt không hợp lệ")
                }
            } else {
                let id = trim(change_alias(search.value));
                let locate = findCountryByName(id);
                if (locate == void 0) {
                    alert('Không tìm thấy quốc gia này: ' + search.value);
                } else {
                    let e = document.getElementById(`${locate}`);
                    e.scrollIntoView();
                }
            }
        }
    }

});
search.addEventListener("change", function() {
    if (search.val != "") {
        let text = search.value;
        if (isNaN(Number(text)) == 0) {
            let stt = Number(text);
            if (stt > 0 && stt <= covid.length) {
                let e = document.getElementById(`${findCountryByRank(getSortType(),stt)}`);
                e.scrollIntoView();
            } else {
                alert("Số stt không hợp lệ")
            }
        } else {
            let id = trim(change_alias(search.value));
            let locate = findCountryByName(id);
            if (locate == void 0) {
                alert('Không tìm thấy quốc gia này: ' + search.value);
            } else {
                let e = document.getElementById(`${locate}`);
                e.scrollIntoView();
            }
        }
    }
})

async function init() {
    await getData();
    let tmp1 = count("vietnam");
    let tmp2 = count();
    createBookMark(getBookMark());
    createRanking(sort(getSortType()));

    vn_nhiem.innerHTML = tmp1.confirmed.toString();
    vn_chua.innerHTML = tmp1.recovered.toString();
    vn_chet.innerHTML = tmp1.deaths.toString();
    vn_hang_nhiem.innerHTML = "Hạng " + findRanking("confirmed", "vietnam").toString();
    vn_hang_chua.innerHTML = "Hạng " + findRanking("recovered", "vietnam").toString();
    vn_hang_chet.innerHTML = "Hạng " + findRanking("deaths", "vietnam").toString();
    tg_nhiem.innerHTML = tmp2.confirmed.toString();
    tg_chua.innerHTML = tmp2.recovered.toString();
    tg_chet.innerHTML = tmp2.deaths.toString();
}

init();