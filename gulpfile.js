import gulp from "gulp";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import { readdirSync } from 'fs';

const rootDir = "../EMa_Estate-Web-Manager/"

// ============== merge dependencies ==============

const mergeDir = rootDir + "views/scripts/";

const getSubDirectories = (path) =>
    readdirSync(path, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

const createMergeDependencies = (depDir, subDirectory) => {
    const depFiles = depDir + subDirectory + "/*.js";

    const func = () => gulp.src(depFiles)
        .pipe(concat(subDirectory + ".js"))
        .pipe(gulp.dest(mergeDir + "build"))

    func();

    gulp.watch(depFiles, func);
}

const createMergeDependenciesTasks = (cb) => {
    const depDir = mergeDir + "build/dependencies/";

    getSubDirectories(depDir)
        .forEach(dir => createMergeDependencies(depDir, dir))

    cb();
}

gulp.task("merge-dependencies", createMergeDependenciesTasks);


// ============== uglify ==============

//will just move them for now

const justMove = (fromPath, toPath) => {
    const func = () => gulp.src(fromPath)
        .pipe(gulp.dest(toPath));

    func();
    gulp.watch(fromPath, func);
}

const moveFilesTask = (cb) => {
    justMove(rootDir + "views/scripts/build/*.js", rootDir + "public/scripts/");
    justMove(rootDir + "views/styles/build/*.css", rootDir + "public/styles/");

    cb();
}

/*
{

*/

const justUglify = (fromPath, toPath) => {
    const func = () => gulp.src(fromPath)
        .pipe(uglify({
            mangle: false
        }
        ))
        .pipe(gulp.dest(toPath));

    func();
    gulp.watch(fromPath, func);
}

const uglifyTask = (cb) => {
    justUglify(rootDir + "views/scripts/build/*.js", rootDir + "public/scripts/");
    //justUglify(rootDir + "views/styles/build/*.css", rootDir + "public/styles/");
}

gulp.task("pseudo-uglify", moveFilesTask);
gulp.task("uglify", uglifyTask);

gulp.task("development", gulp.series("merge-dependencies", "pseudo-uglify"));
gulp.task("release", gulp.series("merge-dependencies", "uglify"));
