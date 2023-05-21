async function getTaskName (words) {
    let taskName = ''
    if(words.length >= 2) {
        for (let i = 1; i < words.length; i++) {
                if(words[i].match(/[0-9]/)) {
                    i++
                }else{
                    taskName += " " + words[i];
            }
        }
    } else {
        return;
    }

    return taskName.trim();
}

function hasNonEnglishLetters(inputString) {
    var pattern = /[^\x00-\x7F]/;
    return pattern.test(inputString);
  }

module.exports = {
    getTaskName,
    hasNonEnglishLetters
}