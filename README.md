# embedded-call-center-widget
embeddable web component provide facility to browse your call center IVR in web browser

## How To use
```javascript
<script src="https://platform.ubicall.com/widget/widget.min.js"></script>
<script type="text/javascript">
  ubiWidget.init({containerId :'Where To Put ubiWidget',licence_key : 'YOUR LICENSE KEY'});
</script>
```

**generate & deploy API documentation :**

  *make sure you add the below line to your* **/etc/hosts** *file :*

    ```
    10.0.0.170  developer.dev.ubicall.com
    ```

``` bash
npm install
sudo grunt preserve # on development
sudo grunt preserve # on production
# node_env [test | development | production]
# config_version - which configuration version you like to use i.e. 20150920 ,it will fetch default version
# in production we use forever : https://github.com/foreverjs/forever
node_env=development config_version=20150920 node widget.js
```
**how to contribute :**

1. will create branch with your feature or fix i.e. feature-xx , fix-xx
2. open pull request describing what your code change and assign developer to review this code ,after reviewing he/she will merge this code on master branch (but make sure it work and has no problem otherwise you will be in charge for pushing untested code on our stable branches)
