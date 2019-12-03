export default function Checker(answers, correct) {
    let result = null;
    if (answers && answers.length > 0) {
        for (var i = 0; i < correct.length; i++) {
            answers[i] === correct[i].value ? result += correct[i].points : result += 0;
        }
    } else {
        result = "Няма предадени отговори!"
    }

    return (
        { result }
    )
}
