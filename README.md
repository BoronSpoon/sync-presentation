# SYNC PDF Presentation（SPP）

## Overview
Web app to syncronize presenting page between presenter and viewer.   
Link：https://vue-firebase-sync.firebaseapp.com

- SPP host: Presenter. Can change current page.
- SPP client: Viewer. Can change current page if presenter allows it.

## Usage
- Remote presentation   
  - Voice chat will be used for audio sharing.
  - SPP will be used for visual sharing.
    - Presenter will open SPP host on PC and share presentation link with viewers.
    - Viewers will view the presentation on their PC and phones with SPP client.
- On-site presentation using projector 
  - PC with SPP client will be connected to a projector
  - Presenter will use phone with SPP host as a page flipper. 
    - If the pc can be plugged to the projector at all times, there will be less hastle of unplugging and plugging VGA cords. 

## Environment
- Language: Javascript
  - UI framework: Vuejs
    - Vuex, Vue Router, Vuetify
- Database：Firebase Realtime Database
- Storage：Firebase storage
- Authentication：Firebase Auth
- Hosting：Firebase Hosting

### How to use
1. This app is hosted for testing purposes therefore, password is set at the start. The password is configured in Firebase Auth.
2. Login screen(```/login```)
   1. Register your Email address. This is used for PDF registeration and authorizing users.
3. Viewer screen(```/```)
   1. Shows currently presentating page.
   2. Click `Present Your PDF Files` and become a presenter.This will redirect you to ```/selecter```.
4. Presentation selector, PDF uploader screen.(```/selecter```)
   1. Click `Select PDF File`->`UPLOAD` to upload your PDF file.
   2. `Your PDFs` shows uploaded PDFs. You can select which PDF to delete (trashcan icon) and present (play icon).
   3. Click `GO Back To Viewer` to become a viewer. You will be redirected to ```/```.
5. Presenter page(```/presenter```)
   1. Press left and right buttons to change current page.
   2. When someone else starts a presentation, your presentation will close and you will be redirected to ```/```.
   3. Click `Exit` to go back to ```/selecter```.

### Problems to solve in the future
- Sync latency is large ~2s
- At `How to use 4.2`, there was a problem where page didn't show. This was be solved by reloading the page but reloading now causes the screen to flicker
- App cannot deal with fast page flipping
