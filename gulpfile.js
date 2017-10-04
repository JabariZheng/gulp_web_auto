var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var imagemin = require("gulp-imagemin");
var cache = require('gulp-cache');
var del = require("del");
var runSequence = require('run-sequence');
var babel = require("gulp-babel");
var useref = require("gulp-useref");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

gulp.task("sass",function(){
	var processors = [ 
		autoprefixer({
			browsers: ["> 5%", "Android >= 4.0"],
			cascade: true,
			remove:true
		})
	];
	return gulp.src("dev/scss/**/*.scss")
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(postcss(processors))
	.pipe(gulp.dest("dev/css"))
	.pipe(browserSync.reload({
		stream:true
	}))
})

gulp.task("browserSync",function(){
	browserSync({
		server:{
			baseDir:"dev"
		}
	})
})

gulp.task("fonts", function() {
  return gulp.src("dev/fonts/**/*")
    .pipe(gulp.dest("dist/fonts"))
})

gulp.task("css", function() {
  return gulp.src("dev/css/**/*.css")
    .pipe(gulp.dest("dist/css"))
})

gulp.task("images",function(){
	return gulp.src("dev/images/**/*.+(png|jpg|jpeg|gif|svg)")
	.pipe(cache(imagemin({
		interlaced:true
	})))
	.pipe(gulp.dest("dist/images"))
})

gulp.task("convertJS",function(){
	return gulp.src("dev/js/**/*.js")
	.pipe(babel({
		presets:["es2015"]
	}))
	.pipe(gulp.dest("dist/js"))
})

gulp.task('useref', function() {
  return gulp.src("dev/*.html")
    .pipe(useref())
    .pipe(gulp.dest("dist"));
});

// gulp.task("clean",function(callback){
// 	del("dist");
// 	return cache.clearAll(callback);
// })

gulp.task("watch",["browserSync","sass"],function(){
	gulp.watch("dev/scss/**/*.scss",["sass"]);
	gulp.watch("dev/*.html",browserSync.reload);
	gulp.watch("dev/js/**/*.js",browserSync.reload);
})

gulp.task("clean:dist",function(callback){
	del(["dist/**/*","!dist/images","!dist/images/**/*"],callback)
})

gulp.task("build",function(callback){
	runSequence(["clean:dist","sass","useref","images","fonts","convertJS","css"],callback)
})

gulp.task("dev",function(callback){
	runSequence(["sass","browserSync","watch"],callback)
})