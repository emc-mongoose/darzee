Become one of the contributors! We thrive to build a welcoming and open community for anyone who wants to use Mongoose via the Web UI
or contribute to it.
[Here](https://github.com/thecodeteam/codedellemc.github.io/wiki/How-to-contribute-to-%7Bcode%7D-and-add-your-project)
we describe how to contribute to any of the {code} projects.

Please, note that all contributors shall follow the Contributor Agreement guidelines
[provided here](https://github.com/thecodeteam/codedellemc.github.io/wiki/Contributor-Agreement).

# Contents

1. [Contributors](#1-contributors)<br/>
2. [Issues](#2-versions)<br/>
3. [Issues](#3-issues)<br/>
3.1 [States](#31-sates)<br/>
3.2. [Specific properties](#32-properties)<br/>
4. [Code](#4-code)<br/>
4.1. [Performance](#41-performance)<br/>

# 1. Contributors

Alphabetically:

* [Andrey Koltsov](https://github.com/AndreyKoltsov1997)
* [Andrey Kurilov](https://github.com/akurilov)
* [Aline Shishatskaya](https://github.com/mandarinSh)
* [Ivan Sysoev](https://github.com/ivan-abc)
* [Pavel Vinogradov](https://github.com/paulgrape)
* [Veronika Kochugova](https://github.com/veronikaKochugova)

# 2. Versions

## 2.1. Backward Compatibility

The following interfaces are mentioned as the subject of the backward compatibility:
1. Input (item list files, scenario files, configuration options)
2. Output files containing the metrics
3. API

## 2.2. Numbers

Mongoose Console uses the [semantic versioning](http://semver.org/). This means that the ***X.Y.Z*** version notation is used:

* ***X***<br/>
    Major version number. Points to significant design and interfaces change. The *backward compatibility* is **not
    guaranteed**.
* ***Y***<br/>
    Minor version number. The *backward compatibility* is guaranteed.
* ***Z***<br/>
    Patch version number. Includes only the defect fixes.


# 3. Issues

Types:
* Defect
* Story
* Task
* Sub-task

| Type     | Description |
|----------|-------------|
| Defect   | The defect/bug which **affects the released version** (the type "Task" should be used if a defect/bug affects the version which is not released yet) |
| Story    | High-level use case or a long-term activity aspect (entirely new page, a complicated UI component, integration with external services, etc.) |
| Task     | A task which couldn't be included into any defect/story |
| Sub-task | A task which could be included into a defect/story |

Mongoose Console's tracker link: https://mongoose-issues.atlassian.net/projects/GUI

## 3.1. States

| State       | Description |
|-------------|-------------|
| OPEN        | All new issues should have this state. The issues are selected from the set of the *OPEN* issues for the proposal and review process. The task is updated w/ the corresponding comment but left in the *OPEN* state if it's considered incomplete/incorrect. Also incomplete/incorrect issue should be assigned back to the reporter.
| IN PROGRESS | The issue is in progress currently either initially done and the corresponding merge request to the `master` branch is created
| RESOLVED    | Issue is done and the corresponding changes are merged into the `master` branch
| CLOSED      | The new version is released containing the corresponding changes

**Note**:
> The corresponding impact probability/frequency is not taken into account in the process currently. For example, all
> defects are assumed to be equally frequently occurring and affecting same users, regardless the particular
> scenario/use case. This approach is used due to the lack of the sufficient statistical information about the Mongoose Web UI
> usage.

## 3.2. Specific properties

| Name                  | Applicable Issue Types | Who is responsible to specify  | Notes
|-----------------------|------------------------|--------------------------------|-------|
| Affected version      | Defect                 | Reporter: user/developer/owner | Only the *latest* version may be used for the defect reporting. The issue should be *rejected* if the reported version is not *latest*.
| Branch                | Defect, Task, Sub-task | Reviewer: developer/owner      |
| Description           | Task, Sub-task         | Reporter: user/developer/owner |
| Expected behaviour    | Defect                 | Reporter: user/developer/owner | The reference to the particular documentation part describing the expected behavior is preferable.
| Fix version           | Defect, Task, Sub-task | Reviewer: developer/owner      |
| Limitations           | Story                  | Reviewer: developer/owner      |
| Observed behaviour    | Defect                 | Reporter: user/developer/owner | Error message, errors.log output file, etc.
| Pull request          | Defect, Task, Sub-task | Reviewer: developer/owner      |
| Resolution commit     | Defect, Task, Sub-task | Reviewer: developer/owner      |
| Root cause            | Defect                 | Reviewer: developer/owner      |
| Start command/request | Defect                 | Reporter: user/developer/owner | Leave only the essential things to reproduce: try to check if possible if the bug is reproducible w/o distributed mode, different concurrency level, item data size, etc.
| Steps                 | Defect                 | Reporter: user/developer/owner |
| Purpose               | Story                  | Reporter: user/developer/owner | Which particular usage of Mongoose should be changed / included within the UI? Related mock ups, screenshots or a detailed discription of the requested feature are encouraged.
| Requirements          | Story                  | Reporter: user/developer/owner | Both functional and performance requirements are mandatory. Optionally the additional requirements/possible enhancements may be specified.


# 4. Code

# 4.1. Performance
Take care about the performance in the ***critical*** places:
* Avoid *frequent* objects instantiation
* Avoid unnecessary *frequent* allocation
* Avoid *frequent* method calls if possible
* Avoid deep call stack if possible
* Avoid multiple component / modules reload 
* Avoid *unnecessary* component observers and their calls 
* Use services for REST API calls
