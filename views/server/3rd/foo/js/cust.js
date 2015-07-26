$(document).ready(function() {
  
  $(".animsition").animsition({
  
    inClass               :   'fade-in-right-sm',
    outClass              :   'fade-out-right-sm',
    inDuration            :    300,
    outDuration           :    300,
    linkElement           :   '.animsition-link',
    loading               :    true,
    loadingParentElement  :   'body', //animsition wrapper element
    loadingClass          :   'animsition-loading',
    unSupportCss          : [ 'animation-duration',
                              '-webkit-animation-duration',
                              '-o-animation-duration'
                            ],   
    overlay               :   false,
    
    overlayClass          :   'animsition-overlay-slide',
    overlayParentElement  :   'body'
  });
});
