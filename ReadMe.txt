dwr应用
DWR is an Ajax remoting framework for Java to make it easy for web pages to interact with Java classes.
http://directwebremoting.org/dwr-demo/


DWR是方便使用AJAX连接JS和JAVA的的一个框架,把服务器端 Java 对象的方法公开给 JavaScript 代码。
如果是用dwr2.0的jar包，还需要同时导入log4j.jar和commons-loggin.jar,勿忘!!
web.xml和dwr.xml放在WEB-INF下!
-----------------------------
配置web.xml:WEB工程启动的时候会在这个里面找到具体所用到的类的路径，由此进行加载

<servlet>
    <servlet-name> dwr-invoke </servlet-name>
    <servlet-class> uk.ltd.getahead.dwr.DWRServlet </servlet>
    <init-param> //这个是调试用，如果正式发布请该为false，不过听说2.0就默认为true了
       <param-name> debug </param-value>
       <param-value> true </param-value>
    </init-param>
    <init-param> //这个是DWR2.0必须的,不然会报java.lang.IllegalArgumentException
       <param-name> classes </param-value>
       <param-value> java.lang.Object </param-value>
</servlet>

<servlet-mapping>
    <servlet-name> dwr-invoke </servlet-name>
    <url-pattern> /dwr/* </url-pattern>
</servlet-mapping>

-----------------------------
配置dwr.xml: dwr.xml的作用是让你告诉DWR哪些class中的哪些方法你需要暴露给前台使用，当DWR启动时候根据dwr.xml这个文件把java类中的方法转成js中可用的类中方法，使前台可以使用。

注:以下是不全按dwr2.0写的，如果用的是DWR2.0，那java里暴露类(蓝字显示)不能写在<create>属性里，应删除后写在<include method="" />前，<param name="class" value="***java里暴露的class,必须写完整路径***" />。


<dwr>
    <allow>
       <create creator="new" javascript="***js调用的class***" class="***java里暴露的class,必须写完整路径***">
           <include method="***java暴露类里要公开的方法，如果不写默认全部公开***" />
       </create>
    </allow>
</dwr>

-----------------------------
在html或js页面中加入
<script src="<%=basePath %>dwr/interface/java里暴露的class"></script>  //切记不能<script *** />这样写
<script src="<%=basePath %>dwr/engine.js"></script>   //Dwr的脚本驱动Js,以上两个必写
<script src="<%=basePath %>dwr/util.js"></script>   //这是个工具包，可以不调用
<script type="text/javascript">
    function doMethod()
    {
        //调用方法:若公开的类是AAA,公开的AAA里的方法是bbb([参数]);
        AAA.bbb([参数],callBack);//回调函数callBack()
    }

    function callBack(data)//data是后台返回的值，名字自取，也可省略，因为JS允许
    {
       处理方法……;//如果callBack()没有写明返回值，可以通过argments[0]拿到
    }
</script>


其实我们调用AAA.bbb([参数],callBack);就是做了以下这一步：
(下面红字是包装好的，不在前台，所以即使你没有创建html或者jsp来调用，也可以通过localhost:8080/工程名/dwr 来看到你暴露的java类进行测试)
    function AAA() { };
    AAA.bbb = function([参数], callback) 
    { 
        DWREngine._execute('/dwr/dwr', 'AAA', 'bbb', [参数], callback); 
    }

通过在dwr.xml暴露的方法得到js里的方法，当我们调用AAA.bbb时候再通过/dwr/dwr转到DWRServlet中去用JAVA里的AAA.bbb方法，然后返回值到callback中(中间经过dwr.xml的convert)


----------------------------
上面对dwr的工作大致分析了下，现在对于参数类型的不同，对dwr.xml也要进行修正。

DWR自动地在Java和JavaScript表示之间调整简单数据类型,这些类型包括Java原生类型和它们各自的封装类表示，还有String、Date、数组和集合类型。但如果参数类型非简单数据类型，则要通过转换。

调用返回JavaBean的java方法

在dwr.xml的<allow>标签中加入

<convert converter="bean" match="***一般来说是javabean***">  //int,String,list等不需要显式的转换就可以被js拿到
     <param name="include" value="***javabean中的属性，用','隔开***" />  //这句可以不写
</convert>

<creator>标签负责公开用于Web远程的类和类的方法，<convertor>标签则负责这些方法的参数和返回类型。convert元素的作用是告诉DWR在服务器端Java 对象表示和序列化的JavaScript之间如何转换数据类型。

这样在js端回调函数直接拿到的data就是一个javabean,可以直接通过data.xxx拿到bean的属性xxx。


调用有JavaBean参数的java方法

dwr.xml配置同上。

在JS端，把要传入的参数写成javabean方式，例：要传入一个名为student的javabean,参数有name,password,则
var stu = {name:"zhangsan",password:"zspassword"}; //这是json的表示方法
AAA.bbb(stu,callBack);


调用返回List、Set或者Map的java方法

dwr.xml配置同上。如果Collection里的数据是简单数据类型，则可不需要写<convert>

在JS端，以List，里面数据是bean为例，data是一个List型，只要用for循环就可以依次拿到数据。
遍历方法1:
for(var i=0;i<data.length;i++)  
    /*对于java方法的返回值为List(Set)的情况，DWR将其转                                 化为Object数组，传递个javascript*/
{
    alert(data[i].name+":"+data[i].password);
}

遍历方法2:
for(var property in data) //property为序号,从0开始
{
    var bean = data[property];
    alert(bean.name+":"+bean.password);
}

相比返回为javabean多了一个遍历而已。

如果java方法的返回值为Map,则如下

for(var property in data) //property为key值
    /*对于 java方法的返回值为Map的情况，DWR将其转化为一个Object，
     其中Object的属性为原Map的key值，属性值为原Map相应的 value值*/
{
  var bean = data[property];
  alert(bean.username);
  alert(bean.password);
}

如果知道key值，则可直接用:data.key拿到value


调用有List、Set或者Map参数的java方法

在dwr.xml的<dwr>标签内加入:<signatures>标签。
<signatures>标签是用来声明java方法中List、Set或者Map参数所包含的确切类，以便java代码作出判断，是js-->java的。
例参数是javabean的List,则只要在参数为javabean的例子里构造时候加上[]即可，如下：

var stu = [{name:"zhangsan",password:"zspassword"},{name:"lisi",password:"lspassword"}];
//把List当作数组来处理
AAA.bbb(stu,callBack);

并且在dwr.xml中增加如下的配置段(刚才试验了下，不加也可以)

<signatures>
 <![CDATA[
  import java.util.List;
  import com.dwr.AAA;     //AAA的包路径要写完整
  import com.dwr.TestBean;  //javabean
  AAA.bbb(List<TestBean>); 
 ]]>
</signatures>

例参数是javabean的Map,key是String,value是javabean,如下:
var stu =
{
    "key1":{name:"zhangsan",password:"zspassword"},
    "key2":{name:"lisi",password:"lspassword"}
};
AAA.bbb(stu,callBack);

并且在dwr.xml中增加如下的配置段(刚才试验了下，不加也可以)

<signatures>
 <![CDATA[
  import java.util.List;
  import com.dwr.AAA;     //AAA的包路径要写完整
  import com.dwr.TestBean;  //javabean
  AAA.bbb(Map<String,TestBean>); 
 ]]>
</signatures>