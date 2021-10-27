const _ = require('lodash')
const { add, read, edit, write } = require('./fileStorage')

// Start with a function Validation (Do we accept the parameters?)
if (process.argv.length !== 3 ||
    (
        process.argv[2].toLowerCase() !== 'roll' &&
        process.argv[2].toLowerCase() !== 'average' &&
        process.argv[2].toLowerCase() !== 'reset'
    )) {
    console.log('Please input "roll" or "average" for this function to work')
} else {

    if (process.argv[2].toLowerCase() === 'roll') {
        // Get Random Number
        const randomNum = Math.floor(Math.random() * 6) + 1
        // Frequent Number
        let frequentNumber = 0
        // Read what is in the file right now
        read('data.json', (err, content) => {
            if (err) {
                errorHandling(err)
            } else {
                roll({ content, randomNum, frequentNumber })
            }
        });
    }

    // AVERAGE FUNCTION
    if (process.argv[2].toLowerCase() === 'average') {
        // Read what is in the file right now
        read('data.json', (err, content) => {
            if (err) {
                errorHandling(err)
            } else {
                average({ content })
            }
        });
    }

    // RESET FUNCTION
    if (process.argv[2].toLowerCase() === 'reset') {
        // Read what is in the file right now
        read('data.json', (err, content) => {
            if (err) {
                errorHandling(err)
            } else {
                reset({ content })
            }
        });
    }


}

const errorHandling = (err) => {
    console.log('something went wrong')
    console.log({ err })
}

const roll = ({ content, frequentNumber, randomNum }) => {
    if (content.rolls) {
        //Check Frequencies
        if (content.frequencies[randomNum]) {
            content.frequencies[randomNum] += 1
        } else {
            content.frequencies[randomNum] = 1
        }
        content.rolls.push(randomNum)

        write('data.json', content, (err, newContent) => {
            if (err) {
                errorHandling(err)
            } else {
                const maxRolled = _.max(Object.values(JSON.parse(newContent).frequencies))
                const highestRolls = Object.keys(JSON.parse(newContent).frequencies).filter((num => {
                    if (JSON.parse(newContent).frequencies[num] === maxRolled) {
                        return num
                    }
                }))
                frequentNumber = highestRolls.join(', ')
                console.log(`You rolled ${randomNum}.`)
                console.log(`The computer has rolled ${frequentNumber} the most times.`)
            }
        })
    } else {
        // if we do not have any previous rolls, we write a rolls in
        const input = { rolls: [randomNum], frequencies: {} }
        input.frequencies[randomNum] = 1
        write('data.json', input, () => { })
        frequentNumber = randomNum
        console.log(`You rolled ${randomNum}.`)
        console.log(`The computer has rolled ${frequentNumber} the most times.`)
    }
}

const average = ({ content }) => {
    if (content.rolls) {
        // if we have previous rolls, we ADD to id
        const avg = _.round(_.mean(content.rolls), 2)
        console.log(`Average is ${avg}.`)
    } else {
        console.log('You do not have any rolls to calcualte the average of')
    }
}

const reset = ({ content }) => {
    if (content.rolls) {
        // if we have previous rolls, we ADD to id
        const input = {}
        write('data.json', input, () => { })
    } else {
        console.log('You have no rolls to reset')
    }
}