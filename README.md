# Scripture Alone

## Notes

## Preparing

1. Ensure you have version 16 of NodeJS installed on your computer https://nodejs.org/en/download/

2. At the root of the project execute the command `npm i` in your terminal


## Running the project

At the root of the project run `npm run dev`
The project should run at http://127.0.0.1:5173/

## Environment variables

```
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, ignored by git
```
`import.meta.env.VITE_SOME_KEY`

