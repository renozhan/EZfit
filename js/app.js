

// footer
const home = document.querySelector('.home');
const diary = document.querySelector('.diary');
const recipe = document.querySelector('.recipe');
function loadPage(pageName) {
    window.location.href = pageName;
}
home.addEventListener('click', () => {
    loadPage('index.html');
})
diary.addEventListener('click', () => {
    loadPage('diary.html');
})
recipe.addEventListener('click', () => {
    loadPage('recipe.html');
})

let diaryData = {};
diaryData = JSON.parse(localStorage.getItem('localdiaryData'));
let recipeData = {};
recipeData = JSON.parse(localStorage.getItem('localrecipeData'));

console.log(diaryData);
console.log(recipeData);
const recipemaincontent = document.querySelector('.recipemaincontent');


const maincontent = document.querySelector('.maincontent');
const opencalendar = document.getElementById('opencalendar');
const currentDate = document.getElementById('current-date');
const calendar = document.getElementById('calendar');
calendar.innerHTML = generateCalendar();

const now = new Date();
year = now.getFullYear();
month = String(now.getMonth() + 1).padStart(2, '0');
day = String(now.getDate()).padStart(2, '0');

const title = document.getElementById('title');
const inputtext = document.getElementById('inputtext');
const savetext = document.getElementById('savetext');

function getDateKey() {
    return `${year}${month}${day}`;
}
currentDate.textContent = getDateKey();

opencalendar.addEventListener('click', () => {
    const opencalendaricon = document.getElementById('opencalimg');
    if (calendar.style.display === 'none') {
        calendar.style.display = 'block';
        opencalendaricon.src = '../svg/uptriangle.png';
        if (window.location.pathname.includes('recipe.html')) {
            recipemaincontent.style.marginTop = '250px';
            recipemaincontent.style.height = '620px';
        } else {
        maincontent.style.marginTop = '250px';
        maincontent.style.height = '620px';
        }
    } else {
        calendar.style.display = 'none';
        opencalendaricon.src = '../svg/downtriangle.png';
        if (window.location.pathname.includes('recipe.html')) {
            recipemaincontent.style.marginTop = '50px';
            recipemaincontent.style.height = '870px';
        } else {
        maincontent.style.marginTop = '50px';
        maincontent.style.height = '870px';
        }   
    }
});
function generateCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDayOfMonth = new Date(now.getFullYear(), month, 1).getDay();
    const daysInMonth = new Date(now.getFullYear(), month + 1, 0).getDate();

    let calendar = '<table>\n<tr>\n<th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th><th>S</th>\n</tr>\n<tr>';

    // Add empty days
    calendar += '<td></td>';
    for (let i = 1; i < firstDayOfMonth; i++) {
        calendar += `<td onclick="updateDate('${i}'); showDiary(getDateKey())">${i}</td>`;
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        // Check if the current day is the same as the displayed day in the calendar
        let isCurrentDay = false;
        if (diaryData[`${year}${String(month+1).padStart(2, '0')}${String(i).padStart(2, '0')}`]) {
            isCurrentDay = true;
        }
        // Add a CSS class for the current day
        const dayClass = isCurrentDay ? 'current-day' : '';

        // Add the day to the calendar
        calendar += `<td class="${dayClass}" onclick="updateDate('${i}'); showDiary(getDateKey())">${i}</td>`;

        if ((i + firstDayOfMonth) % 7 === 0) {
            calendar += '</tr>\n<tr>';
        }
    }

    // Add empty cells at the end of the row
    for (let i = (daysInMonth + firstDayOfMonth) % 7; i < 7; i++) {
        calendar += '<td></td>';
    }

    calendar += '</tr>\n</table>';

    return `<div class="month-name">${calendar}`;
}


function updateDate(d) {
    day = String(d).padStart(2, '0');
    currentDate.textContent = getDateKey();
}

function newDiaryBlock() {
    const newBlock = document.createElement('div');
    newBlock.classList.add('added-block');
    newBlock.innerHTML = `
        <textarea rows="1" class="added-title"></textarea>
        <textarea rows="5" class="added-inputtext"></textarea>
        <button class="added-savetext">o</button>
        <button class="added-deleteblock">-</button>
    `;

    maincontent.appendChild(newBlock);
}

if (window.location.pathname.includes('diary.html')) {
    showDiary(getDateKey());
}
// onclick date
function showDiary(date) {
    if (!window.location.pathname.includes('diary.html')) {
        loadPage('diary.html');
    }
    const storedData = localStorage.getItem('localdiaryData');
    diaryData = JSON.parse(storedData);
    const addedBlocks = document.querySelectorAll('.added-block');
    addedBlocks.forEach((addedBlock) => {
        addedBlock.remove();
    });
    if (diaryData[date]) {
        title.value = diaryData[date].title[0];
        inputtext.value = diaryData[date].content[0];
        if (diaryData[date].title.length > 1) {
            for (let i = 0; i < diaryData[date].title.length - 1; i++) {
                newDiaryBlock();
            }
            const addedTitles = document.querySelectorAll('.added-title');
            const addedContents = document.querySelectorAll('.added-inputtext');
            for (let i = 0; i < diaryData[date].title.length - 1; i++) {
                addedTitles[i].value = diaryData[date].title[i + 1];
                addedContents[i].value = diaryData[date].content[i + 1];
            }

        }
    }
    else {
        // clear title and inputtext
        title.value = '';
        inputtext.value = '';
    }
}

///////////////////// diary

if (window.location.pathname.includes('diary.html')) {
    maincontent.addEventListener('click', (event) => {
        // DEL
        if (event.target.classList.contains('added-deleteblock')) {
            const block = event.target.parentNode;
            const blockIndex = Array.from(maincontent.children).indexOf(block);
            diaryData[getDateKey()].title.splice(blockIndex - 1, 1);
            diaryData[getDateKey()].content.splice(blockIndex - 1, 1);

            localStorage.setItem('localdiaryData', JSON.stringify(diaryData));
            block.remove();
        }
        // OK
        if (event.target.classList.contains('added-savetext')) {
            const titlevalue = event.target.parentNode.querySelector('.added-title').value;
            const contentvalue = event.target.parentNode.querySelector('.added-inputtext').value;
            if (titlevalue && contentvalue) {
                if (!diaryData[getDateKey()]) {
                    diaryData[getDateKey()] = ({ title: [titlevalue], content: [contentvalue] });
                }
                else {
                    diaryData[getDateKey()].title.push(titlevalue);
                    diaryData[getDateKey()].content.push(contentvalue)
                }
                localStorage.setItem('localdiaryData', JSON.stringify(diaryData));
            }

        }
    });

    // init block
    savetext.addEventListener('click', () => {
        if (!diaryData[getDateKey()]) {
            diaryData[getDateKey()] = ({ title: [title.value], content: [inputtext.value] });
        } else {
            diaryData[getDateKey()].title[0] = title.value;
            diaryData[getDateKey()].content[0] = inputtext.value
        }

        localStorage.setItem('localdiaryData', JSON.stringify(diaryData));
    })

    // 右下角的+
    const addtextareaButton = document.getElementById('addtextarea');

    addtextareaButton.addEventListener('click', () => {
        newDiaryBlock();
    });
}

////////////////////////recipe


if (window.location.pathname.includes('recipe.html')) {
    const recipemaincontent = document.querySelector('.recipemaincontent');
    const myFile = document.querySelector('#file')
    const recipetitle = document.querySelector('.recipetitle');
    const recipecontent = document.querySelector('.recipecontent');
    const saverecipeBtn = document.getElementById('saverecipe');
    const closerecipeBtn = document.getElementById('closerecipe');
    const deleterecipeBtn = document.getElementById('deleterecipe');

    const addrecipeBtn = document.getElementById('addrecipe');
    const addrecipeblock = document.getElementById('addrecipeblock');
    const img = document.getElementById('img');
    // addedimg = document.getElementById('added-img');
    let tempimg = '';
    let blockIndex = -1;

    // init page
    if (recipeData) {
            for (let i = 0; i < recipeData.title.length; i++) {
                newRecipeBlock();
            }
            const addedimgs = document.querySelectorAll('.added-img');
            const addedrecipetitles = document.querySelectorAll('.added-recipetitle');
            for (let i = 0; i < recipeData.title.length; i++) {
                if (recipeData.img[i]) {
                addedimgs[i].src = recipeData.img[i];
                } else {
                    addedimgs[i].src = '../svg/default.png';
                }
                addedrecipetitles[i].value = recipeData.title[i];
            }

        }
    function newRecipeBlock() {
        const newBlock = document.createElement('div');
        newBlock.classList.add('added-recipeblock');
        newBlock.innerHTML = `
        <img class = "added-img" src="${recipeData.img[0]}">
        <textarea rows="1" class="added-recipetitle"></textarea>
    `;
        recipemaincontent.appendChild(newBlock);
    }

    // 點食譜圖片，進入編輯視窗
    function recipemaincontentClickHandler(event) {
        const block = event.target.parentNode;
        blockIndex = Array.from(recipemaincontent.children).indexOf(block);
        if (blockIndex > 0) {
            
            addrecipeblock.style.display = 'flex';
            document.body.style.backgroundColor = "rgba(0,0,0,0.2)";
            if (recipeData.img[blockIndex-2]) {
                img.src = recipeData.img[blockIndex-2];
            } else {
                img.src = '../svg/default.png';
            }
            recipetitle.value = recipeData.title[blockIndex-2];
            recipecontent.value = recipeData.content[blockIndex-2];
        }
        recipemaincontent.removeEventListener('click', recipemaincontentClickHandler);
    }
    recipemaincontent.addEventListener('click', recipemaincontentClickHandler);


    // 右下角的+
    addrecipeBtn.addEventListener('click', () => {
        addrecipeblock.style.display = 'flex';
        document.body.style.backgroundColor = "rgba(0,0,0,0.2)";
    });

    // 上傳檔案
    myFile.addEventListener('change', function (e) {
        const file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            tempimg = event.target.result;
            img.src = tempimg;
        };
        reader.readAsDataURL(file);
    });

    // SAVE
    saverecipeBtn.addEventListener('click', () => {
        if (recipeData.title[blockIndex-2]) {
            if (tempimg) {
            recipeData.img[blockIndex-2] = tempimg;
            } 
            recipeData.title[blockIndex-2] = recipetitle.value;
            recipeData.content[blockIndex-2] = recipecontent.value;
        } else {
            recipeData.img.push(tempimg);
            recipeData.title.push(recipetitle.value);
            recipeData.content.push(recipecontent.value)
        }
    
        localStorage.setItem('localrecipeData', JSON.stringify(recipeData));
        addrecipeblock.style.display = 'none';
        document.body.style.backgroundColor = "white";
        loadPage('recipe.html');
    })
    
    // DELETE
    deleterecipeBtn.addEventListener('click', () => {
        recipeData.img.splice(blockIndex-2, 1);
        recipeData.title.splice(blockIndex-2, 1);
        recipeData.content.splice(blockIndex-2, 1)
        localStorage.setItem('localrecipeData', JSON.stringify(recipeData));
        loadPage('recipe.html');
    })

    //close
    closerecipeBtn.addEventListener('click', () => {
        loadPage('recipe.html');
    })
}
