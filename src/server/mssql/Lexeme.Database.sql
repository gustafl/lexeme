USE [master]
GO
/****** Object:  Database [Lexeme]    Script Date: 2018-04-30 16:20:46 ******/
CREATE DATABASE [Lexeme]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Lexeme', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\Lexeme.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Lexeme_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\Lexeme_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [Lexeme] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Lexeme].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Lexeme] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Lexeme] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Lexeme] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Lexeme] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Lexeme] SET ARITHABORT OFF 
GO
ALTER DATABASE [Lexeme] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Lexeme] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Lexeme] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Lexeme] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Lexeme] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Lexeme] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Lexeme] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Lexeme] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Lexeme] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Lexeme] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Lexeme] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Lexeme] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Lexeme] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Lexeme] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Lexeme] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Lexeme] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Lexeme] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Lexeme] SET RECOVERY FULL 
GO
ALTER DATABASE [Lexeme] SET  MULTI_USER 
GO
ALTER DATABASE [Lexeme] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Lexeme] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Lexeme] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Lexeme] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Lexeme] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'Lexeme', N'ON'
GO
ALTER DATABASE [Lexeme] SET QUERY_STORE = OFF
GO
USE [Lexeme]
GO
ALTER DATABASE SCOPED CONFIGURATION SET IDENTITY_CACHE = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
GO
USE [Lexeme]
GO
/****** Object:  Table [dbo].[grammatical_category]    Script Date: 2018-04-30 16:20:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grammatical_category](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NULL,
	[lexical_category_id] [int] NOT NULL,
	[subgroup] [bit] NOT NULL,
 CONSTRAINT [PK_grammatical_category] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grammeme]    Script Date: 2018-04-30 16:20:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grammeme](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[grammatical_category_id] [int] NOT NULL,
	[name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_grammeme] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[inflection]    Script Date: 2018-04-30 16:20:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[inflection](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[lexeme_id] [int] NOT NULL,
	[spelling] [nvarchar](100) NOT NULL,
	[pronounciation] [nvarchar](100) NULL,
 CONSTRAINT [PK_inflection] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[inflection_grammatical_category]    Script Date: 2018-04-30 16:20:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[inflection_grammatical_category](
	[inflection_id] [int] NOT NULL,
	[grammatical_category_id] [int] NOT NULL,
 CONSTRAINT [PK_inflection_grammatical_category] PRIMARY KEY CLUSTERED 
(
	[inflection_id] ASC,
	[grammatical_category_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[language]    Script Date: 2018-04-30 16:20:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[language](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NOT NULL,
	[code] [char](2) NOT NULL,
 CONSTRAINT [PK_language] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_language] UNIQUE NONCLUSTERED 
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[language_grammatical_category]    Script Date: 2018-04-30 16:20:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[language_grammatical_category](
	[language_id] [int] NOT NULL,
	[grammatical_category_id] [int] NOT NULL,
 CONSTRAINT [PK_language_grammatical_category] PRIMARY KEY CLUSTERED 
(
	[language_id] ASC,
	[grammatical_category_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[language_grammeme]    Script Date: 2018-04-30 16:20:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[language_grammeme](
	[language_id] [int] NOT NULL,
	[grammeme_id] [int] NOT NULL,
 CONSTRAINT [PK_language_grammeme] PRIMARY KEY CLUSTERED 
(
	[language_id] ASC,
	[grammeme_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lexeme]    Script Date: 2018-04-30 16:20:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lexeme](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[language_id] [int] NOT NULL,
	[lexical_category_id] [int] NOT NULL,
	[spelling] [varchar](100) NOT NULL,
	[pronounciation] [varchar](100) NOT NULL,
 CONSTRAINT [PK_lexeme] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lexeme_grammatical_category]    Script Date: 2018-04-30 16:20:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lexeme_grammatical_category](
	[lexeme_id] [int] NOT NULL,
	[grammatical_category_id] [int] NOT NULL,
 CONSTRAINT [PK_lexeme_grammatical_category] PRIMARY KEY CLUSTERED 
(
	[lexeme_id] ASC,
	[grammatical_category_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lexical_category]    Script Date: 2018-04-30 16:20:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lexical_category](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_lexical_category] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[translation]    Script Date: 2018-04-30 16:20:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[translation](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[lexeme_id] [int] NOT NULL,
	[language_id] [int] NOT NULL,
	[translation] [varchar](100) NOT NULL,
 CONSTRAINT [PK_translation] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_translation] UNIQUE NONCLUSTERED 
(
	[lexeme_id] ASC,
	[language_id] ASC,
	[translation] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user]    Script Date: 2018-04-30 16:20:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](50) NOT NULL,
	[password] [nvarchar](50) NOT NULL,
	[email] [nvarchar](50) NOT NULL,
	[is_approved] [bit] NOT NULL,
 CONSTRAINT [PK_user] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_log]    Script Date: 2018-04-30 16:20:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_log](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[event] [nvarchar](50) NOT NULL,
	[timestamp] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_user_log] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[user_log] ADD  CONSTRAINT [DF_user_log_timestamp]  DEFAULT (getdate()) FOR [timestamp]
GO
ALTER TABLE [dbo].[grammeme]  WITH CHECK ADD  CONSTRAINT [FK_grammeme_grammatical_category] FOREIGN KEY([grammatical_category_id])
REFERENCES [dbo].[grammatical_category] ([id])
GO
ALTER TABLE [dbo].[grammeme] CHECK CONSTRAINT [FK_grammeme_grammatical_category]
GO
ALTER TABLE [dbo].[inflection]  WITH CHECK ADD  CONSTRAINT [FK_inflection_lexeme] FOREIGN KEY([lexeme_id])
REFERENCES [dbo].[lexeme] ([id])
GO
ALTER TABLE [dbo].[inflection] CHECK CONSTRAINT [FK_inflection_lexeme]
GO
ALTER TABLE [dbo].[inflection]  WITH CHECK ADD  CONSTRAINT [FK_inflection_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[inflection] CHECK CONSTRAINT [FK_inflection_user]
GO
ALTER TABLE [dbo].[inflection_grammatical_category]  WITH CHECK ADD  CONSTRAINT [FK_inflection_grammatical_category_grammatical_category] FOREIGN KEY([grammatical_category_id])
REFERENCES [dbo].[grammatical_category] ([id])
GO
ALTER TABLE [dbo].[inflection_grammatical_category] CHECK CONSTRAINT [FK_inflection_grammatical_category_grammatical_category]
GO
ALTER TABLE [dbo].[inflection_grammatical_category]  WITH CHECK ADD  CONSTRAINT [FK_inflection_grammatical_category_inflection] FOREIGN KEY([inflection_id])
REFERENCES [dbo].[inflection] ([id])
GO
ALTER TABLE [dbo].[inflection_grammatical_category] CHECK CONSTRAINT [FK_inflection_grammatical_category_inflection]
GO
ALTER TABLE [dbo].[language_grammatical_category]  WITH CHECK ADD  CONSTRAINT [FK_language_grammatical_category_grammatical_category] FOREIGN KEY([grammatical_category_id])
REFERENCES [dbo].[grammatical_category] ([id])
GO
ALTER TABLE [dbo].[language_grammatical_category] CHECK CONSTRAINT [FK_language_grammatical_category_grammatical_category]
GO
ALTER TABLE [dbo].[language_grammatical_category]  WITH CHECK ADD  CONSTRAINT [FK_language_grammatical_category_language] FOREIGN KEY([language_id])
REFERENCES [dbo].[language] ([id])
GO
ALTER TABLE [dbo].[language_grammatical_category] CHECK CONSTRAINT [FK_language_grammatical_category_language]
GO
ALTER TABLE [dbo].[language_grammeme]  WITH CHECK ADD  CONSTRAINT [FK_language_grammeme_grammeme] FOREIGN KEY([grammeme_id])
REFERENCES [dbo].[grammeme] ([id])
GO
ALTER TABLE [dbo].[language_grammeme] CHECK CONSTRAINT [FK_language_grammeme_grammeme]
GO
ALTER TABLE [dbo].[language_grammeme]  WITH CHECK ADD  CONSTRAINT [FK_language_grammeme_language] FOREIGN KEY([language_id])
REFERENCES [dbo].[language] ([id])
GO
ALTER TABLE [dbo].[language_grammeme] CHECK CONSTRAINT [FK_language_grammeme_language]
GO
ALTER TABLE [dbo].[lexeme]  WITH CHECK ADD  CONSTRAINT [FK_lexeme_language] FOREIGN KEY([language_id])
REFERENCES [dbo].[language] ([id])
GO
ALTER TABLE [dbo].[lexeme] CHECK CONSTRAINT [FK_lexeme_language]
GO
ALTER TABLE [dbo].[lexeme]  WITH CHECK ADD  CONSTRAINT [FK_lexeme_lexical_category] FOREIGN KEY([lexical_category_id])
REFERENCES [dbo].[lexical_category] ([id])
GO
ALTER TABLE [dbo].[lexeme] CHECK CONSTRAINT [FK_lexeme_lexical_category]
GO
ALTER TABLE [dbo].[lexeme]  WITH CHECK ADD  CONSTRAINT [FK_lexeme_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[lexeme] CHECK CONSTRAINT [FK_lexeme_user]
GO
ALTER TABLE [dbo].[lexeme_grammatical_category]  WITH CHECK ADD  CONSTRAINT [FK_lexeme_grammatical_category_grammatical_category] FOREIGN KEY([grammatical_category_id])
REFERENCES [dbo].[grammatical_category] ([id])
GO
ALTER TABLE [dbo].[lexeme_grammatical_category] CHECK CONSTRAINT [FK_lexeme_grammatical_category_grammatical_category]
GO
ALTER TABLE [dbo].[lexeme_grammatical_category]  WITH CHECK ADD  CONSTRAINT [FK_lexeme_grammatical_category_lexeme] FOREIGN KEY([lexeme_id])
REFERENCES [dbo].[lexeme] ([id])
GO
ALTER TABLE [dbo].[lexeme_grammatical_category] CHECK CONSTRAINT [FK_lexeme_grammatical_category_lexeme]
GO
ALTER TABLE [dbo].[translation]  WITH CHECK ADD  CONSTRAINT [FK_translation_language] FOREIGN KEY([language_id])
REFERENCES [dbo].[language] ([id])
GO
ALTER TABLE [dbo].[translation] CHECK CONSTRAINT [FK_translation_language]
GO
ALTER TABLE [dbo].[translation]  WITH CHECK ADD  CONSTRAINT [FK_translation_lexeme] FOREIGN KEY([lexeme_id])
REFERENCES [dbo].[lexeme] ([id])
GO
ALTER TABLE [dbo].[translation] CHECK CONSTRAINT [FK_translation_lexeme]
GO
ALTER TABLE [dbo].[translation]  WITH CHECK ADD  CONSTRAINT [FK_translation_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[translation] CHECK CONSTRAINT [FK_translation_user]
GO
ALTER TABLE [dbo].[user_log]  WITH CHECK ADD  CONSTRAINT [FK_user_log_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[user_log] CHECK CONSTRAINT [FK_user_log_user]
GO
ALTER TABLE [dbo].[user_log]  WITH CHECK ADD  CONSTRAINT [CK_user_log] CHECK  (([event]='logged_in' OR [event]='logged_out' OR [event]='approved' OR [event]='created' OR [event]='deleted' OR [event]='password_changed'))
GO
ALTER TABLE [dbo].[user_log] CHECK CONSTRAINT [CK_user_log]
GO
USE [master]
GO
ALTER DATABASE [Lexeme] SET  READ_WRITE 
GO
