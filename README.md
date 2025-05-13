# mdtogdocs

Script to convert document internal heading links from markdown Markdown to Google Docs
Google Docs usually imports md files easily, but links internal in imported document are refers to text
The script sets bookmarks to Markdown H2(##) headings,   
then tries to find all references to these headings and replace the links with bookmarks

## problem with imported heading links

link in md document looks like  
    ``[User](#object-user)``  
and headings looks like   
    ``## Object User``  
for more info look [Linking to Heading IDs](https://www.markdownguide.org/extended-syntax/#linking-to-heading-ids)  
Now if you import it to Google Docs, all internal heading links will refer to ``#object-user``  

## solution

Create bookmarks in google document for each heading of the desired headings level (in this case is only level 2)  
Get the bookmark id (in Apps script you can't get the heading id)  
Set the link to ``?tab=t.0#bookmark=[heading id]`` for example ``?tab=t.0#bookmark=id.xuvq2xk8kt6k``  

This script loop trough the level 2 headings, insert bookmarks, then looks for all liknks in the document and tries to match them to existed headings
