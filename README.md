# Review Schedule Calculator

A basic implementation of review schedule dispaly as specified in [instructions.md](./instructions.md)

The implementation is using Typescript with types pretty directly copied from the source instructions.  Jest is configured to support typescript directly and no compilation step is configured.

## Prerequisites
* node 12.X or node 14.x

## Running
1. clone the repository
2. `npm install` -- install dependencies
3. `npm test` -- run unit tests.

## Comments

Overall, I'm pretty happy with the implementation.  Review dates are calculated using a generator which would make it easy to look further into the future. 

### Shortcomings

*Brute Force* -- Currently I'm calculating the next 10 reviews for all employees provided and then sorting them by Date.  This isn't super efficient, but I opted for processing simplicity rather than any sort of performance optimization. 

*Hard Coded* -- Ten is hardcoded in the result (although as I wrote this I did a tiny refactoring to localize to a constant).

*ISO Datestring Sensitivity* -- As long as the Dates are all UTC this code works fine. The test cases are all formatted using ISO Strings so those are mapped nicely.

*Javascript Dates* -- Initially I was going to do this python and then I was like "Just do it in Typscript.  It'll be fun!".  I haven't worked with javascript Dates in a while, but the UTC/timezone APIs I found to lead to a bit uglier code.

