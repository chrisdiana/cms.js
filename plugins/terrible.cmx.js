// terrible for CMX

__plugin__ = {
    meta:{
        "name":"Terrible.CMX.js",
        "short":"terrible",
        "version":"1.0",
        "author":"Byron Lewis Kellett",
        "year":"2016"
    },
    go:function(x,y) {
        $("*").append("Terrible");
        $("*").css("font-family:'Comic Sans MS'");
    }
};
