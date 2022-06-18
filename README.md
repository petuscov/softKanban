# Softkanban

I was pretty tired of naming all my SFDC projects sfXXX, so i replaced the sf for soft.

## Kanban example

![use example](./readme-resources/chrome-capture-2022-5-18.gif)

(I used some random gif recorder chrome extension, limited to 10 seconds and it doesn't capture the movement, but it is there -.-)

## How to use

The LWC softKanban is exposed to lightning tabs, create a new one and use the LWC on it.

## Pending Work (sorted by importance)

- I still have pending working on the UI, and adapt it to accomplish the SLDS guidelines.
- I should simplificate the HTML information propagation by using some Store to save state and use it through all components.
- I should use some kind of configuration to sort the available oppty stages.
- I should figure out some way to keep the oppties order on one stage and prevent the jumping order based on last update.

## Util resources used

- [Drag and drop API](https://web.dev/i18n/es/drag-and-drop/)